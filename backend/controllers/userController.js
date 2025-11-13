import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    // 🔥 Set cookie
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    // 🔥 Set cookie
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", // IMPORTANT to clear the correct cookie
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
