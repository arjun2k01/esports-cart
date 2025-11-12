import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the gatekeeper

const router = express.Router();

// ... (Keep your existing /register and /login routes here) ...
// Make sure to keep the previous code for register and login!

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', async (req, res, next) => {
  // ... (Your existing register code) ...
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post('/login', async (req, res, next) => {
  // ... (Your existing login code) ...
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Protected)
router.get('/profile', protect, async (req, res) => {
  // The middleware 'protect' already found the user and put it in req.user
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  };
  res.json(user);
});

export default router;