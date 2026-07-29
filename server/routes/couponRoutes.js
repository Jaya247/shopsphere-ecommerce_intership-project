import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// Apply auth protection globally to coupons
router.use(protect);

router.post("/", isAdmin, createCoupon);
router.get("/", getCoupons);
router.delete("/:id", isAdmin, deleteCoupon);
router.post("/apply", applyCoupon);

export default router;
