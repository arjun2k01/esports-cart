import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // ❌ removed text: true
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "Generic",
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// text index for search
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
