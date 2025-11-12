import express from 'express';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  
  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if item already exists in cart
  const itemExists = user.cart.find((x) => x.product.toString() === productId);

  if (itemExists) {
    // Update quantity
    itemExists.quantity += quantity;
  } else {
    // Add new item
    user.cart.push({
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  await user.save();
  res.json(user.cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find((x) => x.product.toString() === req.params.id);

  if (item) {
    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((x) => x.product.toString() !== req.params.id);

  await user.save();
  res.json(user.cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json([]);
});

export default router;