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

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "User no longer exists." });

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Admin-only routes
export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ message: "Admin access only" });
  next();
};
