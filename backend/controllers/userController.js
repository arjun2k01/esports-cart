// backend/controllers/userController.js
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// Helper: safe user payload (never leak password)
const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// =========================
// REGISTER
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // ✅ Sets HttpOnly cookie token
    generateToken(res, user._id);

    return res.status(201).json({
      success: true,
      user: toSafeUser(user),
    });
  } catch (err) {
    // Duplicate key safety
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
};

// =========================
// LOGIN
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Sets HttpOnly cookie token
    generateToken(res, user._id);

    return res.json({
      success: true,
      user: toSafeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      expires: new Date(0),
      path: "/",
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Logout failed" });
  }
};

// =========================
// GET PROFILE (requires protect)
// =========================
export const getProfile = async (req, res) => {
  try {
    // `protect` middleware attaches req.user
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ success: true, user: toSafeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to get profile" });
  }
};

// =========================
// UPDATE PROFILE (requires protect)
// =========================
export const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name?.trim()) user.name = name.trim();
    if (email?.trim()) user.email = email.toLowerCase().trim();
    if (password) user.password = password; // hashed in model pre-save if you have it

    const updated = await user.save();

    return res.json({ success: true, user: toSafeUser(updated) });
  } catch (err) {
    // Duplicate email safety
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: err.message || "Failed to update profile" });
  }
};

// =========================
// ADMIN: GET USERS
// =========================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users: users.map(toSafeUser) });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
};

// =========================
// ADMIN: DELETE USER
// =========================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.deleteOne({ _id: id });
    return res.json({ success: true, message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete user" });
  }
};
