import connectDB from "./connectDB.js";
import User from "../backend/models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema, validateInput } from "../backend/utils/validation.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "https://esports-cart.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await connectDB();

    // REGISTER
    if (req.method === "POST" && req.url.endsWith("/register")) {
      const validated = validateInput(registerSchema, req.body);
      const { name, email, password } = validated;

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, isAdmin: false });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    }

    // LOGIN
    if (req.method === "POST" && req.url.endsWith("/login")) {
      const validated = validateInput(loginSchema, req.body);
      const { email, password } = validated;

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
