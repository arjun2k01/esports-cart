import connectDB from "./connectDB.js";
import Order from "../backend/models/orderModel.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (req.method === "POST") {
    const { orderItems, totalPrice } = req.body;
    const order = await Order.create({ user: user.id, orderItems, totalPrice });
    return res.status(201).json(order);
  }

  if (req.method === "GET") {
    const orders = await Order.find({ user: user.id });
    return res.status(200).json(orders);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
