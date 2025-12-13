// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const app = express();

// ---- DB ----
await connectDB();

// ---- Middlewares ----
app.use(helmet());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

/**
 * ✅ CORS (Rock-solid)
 * Allows:
 * - https://esports-cart.vercel.app
 * - localhost dev (optional)
 *
 * IMPORTANT:
 * - Works with cookies: credentials: true
 * - Does not fail silently if env missing
 */
const allowlist = new Set(
  (process.env.CLIENT_URL || "https://esports-cart.vercel.app")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

// Add local dev origins safely (optional)
allowlist.add("http://localhost:5173");
allowlist.add("http://localhost:3000");

app.use(
  cors({
    origin: (origin, cb) => {
      // Requests like Postman/curl may not send origin
      if (!origin) return cb(null, true);

      if (allowlist.has(origin)) return cb(null, true);

      // ❗ Do NOT throw hard failures in production without logging
      console.log("❌ CORS blocked origin:", origin);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// Must respond to preflight with same CORS settings
app.options("*", cors({ origin: true, credentials: true }));

// ---- Health ----
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// ---- Routes ----
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ---- Errors ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV || "dev"})`);
  console.log("✅ CORS allowlist:", Array.from(allowlist));

    // Auto-create admin user on startup if not exists
  const ensureAdminExists = async () => {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@esports.com";
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
        const adminName = process.env.ADMIN_NAME || "Admin";
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true,
          phone: "+91-9999999999",
          address: "Admin Address",
          city: "Admin City",
          state: "Admin State",
          postalCode: "000000",
          country: "India",
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
      }
    } catch (err) {
      console.error("⚠️ Error creating admin:", err.message);
    }
  };
  ensureAdminExists();
});
