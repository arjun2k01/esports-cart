import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // user field optional or removed
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // FIXED 🔥
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
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
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
