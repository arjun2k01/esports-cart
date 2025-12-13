import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import logger from "./utils/logger.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected for admin setup");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@esportscart.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminName = process.env.ADMIN_NAME || "Admin";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      logger.warn(`Admin already exists: ${adminEmail}`);
      console.log("❌ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
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

    logger.info({ email: adminEmail, userId: admin._id, action: "admin_created" });
    console.log("\n✅ Admin created successfully!");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n⚠️  Change this password immediately after first login!");

    process.exit(0);
  } catch (err) {
    logger.error({ message: err.message });
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();
