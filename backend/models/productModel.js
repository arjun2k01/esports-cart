import mongoose from 'mongoose';

// We define the structure of a product in our database
const productSchema = new mongoose.Schema(
  {
    // We keep your numeric ID for frontend compatibility
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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
  },
  {
    // Adds `createdAt` and `updatedAt` fields automatically
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;