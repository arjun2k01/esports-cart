import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Validate MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set. Check your .env file.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds - increased from 5s
      socketTimeoutMS: 45000,           // 45 seconds for socket operations
      connectTimeoutMS: 10000,           // 10 seconds for connection
      retryWrites: true,
      w: "majority",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("Full Error:", error);
    
    // Don't exit immediately on Vercel - allow graceful shutdown
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error; // Re-throw for production to handle gracefully
  }
};

export default connectDB;
