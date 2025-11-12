import express from 'express';
import Order from '../models/orderModel.js';
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
    const err = new Error('No order items');
    next(err);
    return;
  }

  try {
    const order = new Order({
      // --- THIS IS THE FIX ---
      // We manually map the fields from the cart (x) to the fields
      // our OrderModel is expecting.
      orderItems: orderItems.map((x) => ({
        name: x.name,
        qty: x.quantity, // map 'quantity' from cart to 'qty' in model
        image: x.image,
        price: x.price,
        product: x._id, // map '_id' from cart to 'product' in model
      })),
      // --- END OF FIX ---
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: true, // Assuming payment is successful for this demo
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error); // Pass the error to our custom error handler
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export default router;