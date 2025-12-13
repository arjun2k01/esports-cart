// backend/controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * Helper: safely compare password
 * - If your model has user.matchPassword(), we use it.
 * - Otherwise fallback to bcrypt.compare().
 */
const verifyPassword = async (user, plain) => {
  if (!plain) return false;
  if (typeof user.matchPassword === "function") {
    return await user.matchPassword(plain);
  }
  return await bcrypt.compare(plain, user.password);
};

/**
 * @route   POST /api/users/auth
 * @desc    Login (sets HttpOnly cookie)
 * @access  Public
 */
export const authUser = async (req, res) => {
  const { email, password } = req.body || {};

  const user = await User.findOne({ email: String(email || "").toLowerCase() });

  if (user && (await verifyPassword(user, password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
    return;
  }

  res.status(401);
  throw new Error("Invalid email or password");
};

/**
 * @route   POST /api/users
 * @desc    Register (optionally auto-login by setting cookie)
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password, // assume model hashes via pre-save hook; if not, bcrypt will still work if you add hook
  });

  // Auto-login after signup (enterprise-friendly UX)
  generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  });
};

/**
 * @route   POST /api/users/logout
 * @desc    Logout (clears cookie)
 * @access  Public (safe even if already logged out)
 */
export const logoutUser = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.json({ message: "Logged out" });
};

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body?.name ?? user.name;
  if (req.body?.email) user.email = String(req.body.email).toLowerCase().trim();
  if (req.body?.password) user.password = req.body.password;

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
    createdAt: updated.createdAt,
  });
};

/**
 * @route   GET /api/users
 * @desc    Admin: list users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

/**
 * @route   GET /api/users/:id
 * @desc    Admin: get user by id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

/**
 * @route   PUT /api/users/:id
 * @desc    Admin: update user
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body?.name !== undefined) user.name = req.body.name;
  if (req.body?.email !== undefined) user.email = String(req.body.email).toLowerCase().trim();
  if (req.body?.isAdmin !== undefined) user.isAdmin = Boolean(req.body.isAdmin);

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
    createdAt: updated.createdAt,
  });
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Admin: delete user
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Safety: prevent deleting yourself (optional but recommended)
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot delete your own admin account");
  }

  await user.deleteOne();
  res.json({ message: "User removed" });
};
