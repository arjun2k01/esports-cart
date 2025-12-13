// backend/routes/orderRoutes.js
import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToShipped,
  updateOrderToDelivered,
  cancelOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.route("/").post(protect, addOrderItems);

// Logged-in user's orders
router.route("/myorders").get(protect, getMyOrders);

// Admin: all orders
router.route("/").get(protect, admin, getOrders);

// Single order (owner or admin check happens inside controller)
router.route("/:id").get(protect, getOrderById);

// Payment update (temporary until Phase 3 webhooks)
router.route("/:id/pay").put(protect, updateOrderToPaid);

// Admin shipping + delivery
router.route("/:id/ship").put(protect, admin, updateOrderToShipped);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

// Cancel (owner or admin)
router.route("/:id/cancel").put(protect, cancelOrder);

export default router;
