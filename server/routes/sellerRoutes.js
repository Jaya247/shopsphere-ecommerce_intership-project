import express from "express";
import { protect, isSeller } from "../middleware/authMiddleware.js";
import {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
} from "../controllers/sellerController.js";

const router = express.Router();

// Apply auth protection & Seller role checks
router.use(protect, isSeller);

router.get("/dashboard", getSellerDashboard);
router.get("/products", getSellerProducts);
router.get("/orders", getSellerOrders);

export default router;
