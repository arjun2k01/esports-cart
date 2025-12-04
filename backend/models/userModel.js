import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: true,
    },
      googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
    isAdmin: {
      type: Boolean,
      default: false,,
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    }
    },
  },
  { timestamps: true }
);

// HASH PASSWORD ON SAVE
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (err) {
    console.error("❌ Password hashing error:", err);
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
