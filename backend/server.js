// 1. Import dependencies (using ES Module syntax)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from "./routes/productRoutes.js"; // Import product routes

// 2. Load environment variables
dotenv.config();

// 3. Create Express app
const app = express();

// 4. Use Middleware
app.use(cors()); // Allow cross-origin requests (from your frontend)
app.use(express.json()); // Allow app to parse JSON from request bodies

// 5. Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// 6. Define Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Use the product routes
app.use('/api/products', productRoutes);

// 7. Start the server
const PORT = process.env.PORT || 5000;

// Call connectDB and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});