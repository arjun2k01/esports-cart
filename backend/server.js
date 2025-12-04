// backend/server.js
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

(async () => {


// Connect DB
// FIX: Only connect if NOT in test mode. Tests handle their own connection.
if (process.env.NODE_ENV !== 'test') {
  await connectDB();
}

const app = express();

// ⭐ Required for Render proxy + secure cookies
app.set("trust proxy", 1);

// ---------------------- SECURITY ----------------------
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// ---------------------- RATE LIMIT ----------------------
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

// ---------------------- CORS FIX (FINAL) ----------------------
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow backend-to-backend or mobile requests (no origin)
      if (!origin) return callback(null, true);

      const vercelDomain = /\.vercel\.app$/;     // Allow any *.vercel.app (production + preview)
      const localhost = /^http:\/\/localhost:\d+$/; // Allow localhost for dev

      if (vercelDomain.test(origin) || localhost.test(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
  })
);

// ---------------------- BODY PARSING ----------------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// ---------------------- ROUTES ----------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

// ---------------------- ROOT ROUTE ----------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---------------------- ERROR HANDLER ----------------------
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.message);
  res.status(500).json({
    message: err.message || "Server error",
  });
});

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 5000;

// At the end of server.js
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
  
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
