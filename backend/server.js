// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import "dotenv/config";

// ✅ Your existing routes (adjust names only if your repo uses different files)
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ If you already have a custom error middleware, you can keep it.
// We'll handle errors inline here to avoid mismatch issues.

const app = express();

// --------------------
// Trust proxy (important for Render/NGINX/Cloudflare)
// --------------------
app.set("trust proxy", 1);

// --------------------
// Security middlewares
// --------------------
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// JSON body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// --------------------
// Rate limiting (basic, production-friendly defaults)
// --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300, // adjust if needed
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --------------------
// ✅ CORS (enterprise-safe allowlist)
// NEVER use *.vercel.app wildcard in production
// --------------------
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g. https://esports-cart.vercel.app
  process.env.CLIENT_URL_2, // optional preview domain
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      // allow server-to-server / curl / postman (no origin)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// --------------------
// ✅ CSRF protection
// - Uses cookie-based CSRF secret (httpOnly)
// - Frontend reads token from /csrf-token and sends header X-CSRF-Token
// --------------------
const isProd = process.env.NODE_ENV === "production";

const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // secret cookie must be httpOnly
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  },
});

// Apply CSRF to all routes AFTER cookieParser
// csurf ignores GET/HEAD/OPTIONS automatically, so safe for reads.
app.use(csrfProtection);

// Endpoint to fetch CSRF token for SPA
app.get("/api/auth/csrf-token", (req, res) => {
  const token = req.csrfToken();

  // Put token in a NON-httpOnly cookie so frontend can read if needed.
  // (Double-submit pattern)
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return res.status(200).json({ csrfToken: token });
});

// --------------------
// Health check
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, service: "backend" });
});

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// --------------------
// 404 handler
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
// ✅ Error handler (CSRF + general)
// --------------------
app.use((err, req, res, next) => {
  // CSRF errors
  if (err && err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      message: "Invalid or missing CSRF token. Please refresh and try again.",
    });
  }

  // CORS errors
  if (err && String(err.message || "").startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  // Mongoose bad ObjectId
  if (err && err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// --------------------
// DB + server start
// --------------------
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Server failed to start:", e.message);
    process.exit(1);
  }
};

start();
