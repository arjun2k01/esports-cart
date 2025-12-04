import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// CREATE ORDER (SERVER VALIDATES PRICE!)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No items in order" });

    // --- SERVER-SIDE PRICE VALIDATION ---
    const ids = orderItems.map((i) => i.product);
    const dbProducts = await Product.find({ _id: { $in: ids } });

    let serverTotal = 0;

    for (const item of orderItems) {
      const product = dbProducts.find(
        (p) => p._id.toString() === item.product
      );
      if (!product)
        return res.status(400).json({ message: "Product not found" });

      serverTotal += product.price * item.qty;

      // Stock check
      if (product.countInStock < item.qty)
        return res
          .status(400)
          .json({ message: `${product.name} is out of stock` });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: serverTotal,
    });

    // Update stock atomically
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// GET LOGGED-IN USER ORDERS
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(orders);
};

// ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  res.json(orders);
};

// ADMIN: MARK AS DELIVERED
export const updateOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.json({ message: "Order marked as delivered" });
};

// GET SINGLE ORDER BY ID (USER CAN GET THEIR OWN ORDERS)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorised" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
