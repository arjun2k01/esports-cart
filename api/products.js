import connectDB from "./connectDB.js";
import Product from "../backend/models/productModel.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const products = await Product.find({});
    return res.status(200).json(products);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
