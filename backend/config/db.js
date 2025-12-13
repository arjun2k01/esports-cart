// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    // Recommended modern mongoose flags handled internally in newer versions
    const conn = await mongoose.connect(uri, {
      // keep these minimal to avoid version mismatches
      autoIndex: process.env.NODE_ENV !== "production", // ✅ disable autoIndex in prod
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB runtime error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error?.message || error);
    process.exit(1);
  }
};

export default connectDB;
