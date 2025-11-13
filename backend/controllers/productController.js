import Product from "../models/productModel.js";

// GET ALL PRODUCTS (supports search/filter)
export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid product ID" });
  }
};

// CREATE PRODUCT (ADMIN)
export const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, brand, countInStock } = req.body;

    if (!name || !price || !image || !category)
      return res.status(400).json({ message: "Missing required fields" });

    const product = new Product({
      name,
      price,
      image,
      category,
      brand,
      countInStock: countInStock || 0,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT (ADMIN)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const { name, price, image, category, brand, countInStock } = req.body;

    product.name = name || product.name;
    product.price = price ?? product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock ?? product.countInStock;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
