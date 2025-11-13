import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ⭐ REQUIRED for Render proxy + secure cookies ⭐
app.set("trust proxy", 1);

// -------------------------------- SECURITY --------------------------------
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// -------------------------------- RATE LIMIT --------------------------------
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// -------------------------------- CORS FIX --------------------------------
// This MUST match your Vercel domain exactly
const allowedOrigin = "https://esports-cart.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// -------------------------------- BODY PARSING --------------------------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// -------------------------------- API ROUTES --------------------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

// -------------------------------- ROOT --------------------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// -------------------------------- ERROR HANDLER --------------------------------
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

// -------------------------------- START SERVER --------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
