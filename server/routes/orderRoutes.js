import express from "express";
import { protect, isSeller } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  requestOrderReturn,
  requestOrderRefund,
  processOrderReturn,
  processOrderRefund,
} from "../controllers/orderController.js";

const router = express.Router();

// Apply auth protect generally on orders
router.use(protect);

router.post("/", placeOrder);
router.get("/my-orders/:userId", getMyOrders);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/pay", updatePaymentStatus);
router.delete("/:id", deleteOrder);

// ======================================
// New Return & Refund Management Routes
// ======================================
router.post("/:id/return", requestOrderReturn);
router.post("/:id/refund", requestOrderRefund);
router.put("/:id/return-process", isSeller, processOrderReturn);
router.put("/:id/refund-process", isSeller, processOrderRefund);

export default router;