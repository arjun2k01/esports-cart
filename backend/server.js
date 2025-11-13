import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// ---------- SECURITY MIDDLEWARE ----------
app.use(helmet()); // Security headers
app.use(xss()); // Prevent XSS
app.use(mongoSanitize()); // Prevent Mongo injections
app.use(cookieParser()); // Cookie parsing

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100, // limit each IP
  message: "Too many requests. Please try again later.",
});
app.use("/api", limiter);

// ---------- CORS ----------
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error("CORS blocked: origin not allowed => " + origin),
        false
      );
    },
    credentials: true,
  })
);

// ---------- BODY PARSING ----------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// ---------- API ROUTES ----------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

// ---------- PROD DEPLOYMENT ----------
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
