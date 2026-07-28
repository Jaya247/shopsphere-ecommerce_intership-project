import express from "express";

import {
  placeOrder,
  getOrders,
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
// Get All Orders
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