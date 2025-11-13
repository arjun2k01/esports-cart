import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderDelivered,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// User
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/deliver", protect, adminOnly, updateOrderDelivered);

export default router;
