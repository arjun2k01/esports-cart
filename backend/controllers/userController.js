import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Registering user:", { name, email });

    if (!name || !email || !password) {
      console.log("Missing fields");
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email }).catch(err => {
      console.error("Error checking if user exists:", err);
      throw err;
    });

    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log("Creating user...");
    const user = await User.create({ name, email, password }).catch(err => {
      console.error("Error creating user:", err.message, err.code);
      throw err;
    });

    console.log("User created successfully:", user._id);

    generateToken(res, user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (err) {
    console.error("Registration error:", err.message, err.code);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "email";
      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: err.message || "Registration failed",
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    generateToken(res, user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: err.message || "Login failed",
    });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

// GET PROFILE
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// ADMIN: GET ALL USERS
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// ADMIN: DELETE USER
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ message: "User not found" });
  if (user.isAdmin)
    return res.status(403).json({ message: "Cannot delete an admin account" });
  await user.deleteOne();
  res.json({ message: "User deleted" });
};
