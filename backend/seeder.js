import mongoose from 'mongoose';
import dotenv from 'dotenv';
// This import will require the next file
import { products } from './data/products.js'; 
import Product from './models/productModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    // Clear existing products
    await Product.deleteMany();
    
    // Insert products from our file
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    // Clear existing products
    await Product.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

// Check command-line arguments to see if we're importing or destroying
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}