// backend/routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/", registerUser);          // Register
router.post("/login", loginUser);        // Login
router.post("/logout", logoutUser);      // Logout

// Current user (cookie-auth)
router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin-only
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
