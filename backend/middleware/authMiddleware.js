import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect Routes (User must be logged in)
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Prefer HttpOnly cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2) Fallback for API tools like Postman
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized. No token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user with isAdmin field included
    req.user = await User.findById(decoded.userId).select("-password");
    
    // DEBUG LOGS - Remove after fixing
    console.log('Auth middleware - decoded userId:', decoded.userId);
    console.log('Auth middleware - found user:', req.user ? { 
      id: req.user._id, 
      email: req.user.email, 
      isAdmin: req.user.isAdmin 
    } : null);
    
    if (!req.user) {
      console.log('Auth middleware - User not found in database');
      return res.status(401).json({ message: "User no longer exists." });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Admin-only routes
export const adminOnly = (req, res, next) => {
  console.log('Admin middleware - checking user:', req.user ? {
    email: req.user.email,
    isAdmin: req.user.isAdmin
  } : null);
  
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
