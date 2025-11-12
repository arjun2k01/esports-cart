import connectDB from "./connectDB.js";
import User from "../backend/models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST" && req.url.endsWith("/register")) {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    return res.status(201).json({ token: generateToken(user._id), user });
  }

  if (req.method === "POST" && req.url.endsWith("/login")) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ token: generateToken(user._id), user });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
