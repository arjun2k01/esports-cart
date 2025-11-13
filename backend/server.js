import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// ====================================
// ✅ CONNECT DATABASE
// ====================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const app = express();

// ====================================
// ✅ FIXED CORS CONFIG
// ====================================
// Render + Vercel + Localhost accepted origins
const allowedOrigins = [
  "https://esports-cart.vercel.app",  // Production frontend
  "https://esports-cart-ea54zx6px-arjun2k01s-projects.vercel.app", // Preview frontend
  "http://localhost:5173", // Local dev
  process.env.CLIENT_ORIGIN // Optional from env
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-side calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ====================================
// ✅ BODY PARSER
// ====================================
app.use(express.json());

// ====================================
// ✅ TEST ROUTE
// ====================================
app.get("/api/test", (req, res) =>
  res.json({ message: "✅ Backend is running!" })
);

// ====================================
// ✅ API ROUTES
// ====================================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ai", aiRoutes);

// ====================================
// ✅ ERROR MIDDLEWARE
// ====================================
app.use(notFound);
app.use(errorHandler);

// ====================================
// ✅ START SERVER
// ====================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
