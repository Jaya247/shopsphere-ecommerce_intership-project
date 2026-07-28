import express from "express";

import {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// ======================================
// Place Order
// ======================================
router.post("/", placeOrder);

// ======================================
// My Orders (Logged In User)
// ======================================
router.get("/my-orders/:userId", getMyOrders);

// ======================================
// Get All Orders (Admin)
// ======================================
router.get("/", getOrders);

// ======================================
// Get Single Order
// ======================================
router.get("/:id", getOrderById);

// ======================================
// Update Order Status
// ======================================
router.put("/:id/status", updateOrderStatus);

// ======================================
// Update Payment Status
// ======================================
router.put("/:id/pay", updatePaymentStatus);

// ======================================
// Delete Order
// ======================================
router.delete("/:id", deleteOrder);

export default router;