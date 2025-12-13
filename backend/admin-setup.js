// Admin Setup Script - Run once to upgrade admin@esports.com to admin
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

const upgradeAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.findOneAndUpdate(
      { email: 'admin@esports.com' },
      { isAdmin: true },
      { new: true }
    );

    if (result) {
      console.log('✅ User upgraded to admin successfully!');
      console.log('User:', result);
    } else {
      console.log('❌ User with email admin@esports.com not found');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

upgradeAdminUser();
