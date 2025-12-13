import express from "express";
import passport from "passport";
import { validateInput, registerSchema, loginSchema } from "../utils/validation.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER with validation
router.post(
  "/register",
  registerLimiter,
  catchAsync(async (req, res) => {
    const { name, email, password } = validateInput(registerSchema, req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    logger.info({ email, action: "user_registered" });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  })
);

// LOGIN with validation
router.post(
  "/login",
  loginLimiter,
  catchAsync(async (req, res) => {
    const { email, password } = validateInput(loginSchema, req.body);

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn({ email, action: "failed_login" });
      throw new AppError("Invalid credentials", 401);
    }

    logger.info({ email, action: "user_login" });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  })
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&user=${JSON.stringify(req.user)}`);
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    logger.info({ action: "user_logout" });
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Get current user
router.get(
  "/me",
  catchAsync(async (req, res) => {
    if (!req.user) throw new AppError("Not authenticated", 401);
    res.json({ success: true, user: req.user });
  })
);

export default router;
