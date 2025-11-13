import express from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js'; // Import Product model
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 1. Create the order
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Ensure we map _id to product reference
        qty: x.quantity
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: true, // Mock payment
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // 2. Decrement Stock
    // We loop through items and update the product database
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      if (product) {
        product.countInStock = product.countInStock - item.quantity;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export default router;