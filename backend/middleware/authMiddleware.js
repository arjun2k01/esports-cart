// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * protect:
 * - Reads HttpOnly cookie "token"
 * - Verifies JWT payload { id }
 * - Attaches req.user
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      res.status(401);
      throw new Error("Not authorized, invalid token payload");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (err) {
    // JWT invalid/expired or other auth issue
    res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 401);
    next(err);
  }
};

/**
 * admin:
 * - Requires protect first
 * - Checks req.user.isAdmin
 */
export const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();

  res.status(403);
  throw new Error("Admin access required");
};
