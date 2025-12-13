// backend/controllers/orderController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const to2 = (num) =>
  Number((Math.round((Number(num) + Number.EPSILON) * 100) / 100).toFixed(2));

/**
 * Create Order (server-authoritative + atomic stock decrement via transaction)
 */
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const normalized = orderItems.map((it) => ({
    product: String(it.product || it._id || it.productId || ""),
    qty: Number(it.qty || it.quantity || 0),
  }));

  if (
    normalized.some(
      (it) => !mongoose.Types.ObjectId.isValid(it.product) || it.qty <= 0
    )
  ) {
    res.status(400);
    throw new Error("Invalid cart payload");
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const productIds = normalized.map((it) => it.product);
      const products = await Product.find({ _id: { $in: productIds } }).session(
        session
      );

      if (products.length !== productIds.length) {
        throw new Error("Some products no longer exist");
      }

      // Build authoritative orderItems and validate stock
      const serverItems = normalized.map((it) => {
        const p = products.find((x) => String(x._id) === it.product);
        if (!p) return null;

        const countInStock = Number(p.countInStock ?? 0);
        if (it.qty > countInStock) {
          throw new Error(`Not enough stock for: ${p.name}`);
        }

        return {
          name: p.name,
          qty: it.qty,
          image: p.image,
          price: Number(p.price),
          product: p._id,
        };
      });

      // Atomic decrement stock
      for (const it of normalized) {
        const updated = await Product.updateOne(
          { _id: it.product, countInStock: { $gte: it.qty } },
          { $inc: { countInStock: -it.qty } },
          { session }
        );

        if (updated.modifiedCount !== 1) {
          throw new Error("Stock changed. Please refresh cart and try again.");
        }
      }

      const itemsPrice = to2(
        serverItems.reduce(
          (acc, item) => acc + Number(item.price) * Number(item.qty),
          0
        )
      );

      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = to2(itemsPrice * 0.18);
      const totalPrice = to2(itemsPrice + shippingPrice + taxPrice);

      const order = new Order({
        user: req.user._id,
        orderItems: serverItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderStatus: "PENDING",
      });

      createdOrder = await order.save({ session });
    });

    session.endSession();
    return res.status(201).json(createdOrder);
  } catch (err) {
    session.endSession();
    res.status(400);
    throw new Error(err.message || "Order creation failed");
  }
});

/**
 * Get order by ID (owner or admin)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = String(order.user?._id) === String(req.user._id);
  if (!isOwner && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

/**
 * Get logged in user's orders
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

/**
 * Admin: get all orders
 */
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

/**
 * Mark order as paid (Phase 3 will switch this to webhook-driven)
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Cancelled orders cannot be paid");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.orderStatus = "PAID";
  order.paymentResult = req.body?.paymentResult || order.paymentResult;

  const updated = await order.save();
  res.json(updated);
});

/**
 * Admin: mark shipped + tracking details
 * body: { carrier, trackingNumber }
 */
export const updateOrderToShipped = asyncHandler(async (req, res) => {
  const { carrier = "", trackingNumber = "" } = req.body || {};
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Cancelled orders cannot be shipped");
  }

  if (!order.isPaid) {
    res.status(400);
    throw new Error("Order must be paid before shipping");
  }

  order.carrier = String(carrier);
  order.trackingNumber = String(trackingNumber);
  order.shippedAt = new Date();
  order.orderStatus = "SHIPPED";

  const updated = await order.save();
  res.json(updated);
});

/**
 * Admin: mark delivered
 */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Cancelled orders cannot be delivered");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.orderStatus = "DELIVERED";

  const updated = await order.save();
  res.json(updated);
});

/**
 * Cancel order (admin OR owner if not shipped)
 * body: { reason }
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason = "" } = req.body || {};
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = String(order.user) === String(req.user._id);
  const isAdmin = !!req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  // If shipped, only admin can cancel
  if (order.orderStatus === "SHIPPED" && !isAdmin) {
    res.status(400);
    throw new Error("Order already shipped. Contact support.");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Order already cancelled");
  }

  order.isCancelled = true;
  order.cancelledAt = new Date();
  order.cancelReason = String(reason);
  order.orderStatus = "CANCELLED";

  const updated = await order.save();
  res.json(updated);
});
