import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getUsers,
  deleteUser,
  updateProfile,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// User Protected
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
