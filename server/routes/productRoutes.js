import express from "express";
import { protect, isSeller } from "../middleware/authMiddleware.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  searchProducts,
  getCategories,
} from "../controllers/productController.js";

const router = express.Router();

// =============================
// Special Routes
// =============================
router.get("/featured", getFeaturedProducts);
router.get("/new", getNewArrivals);
router.get("/bestsellers", getBestSellers);
router.get("/search", searchProducts);
router.get("/categories", getCategories);

// =============================
// CRUD Routes
// =============================
router.post("/", protect, isSeller, addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, isSeller, updateProduct);
router.delete("/:id", protect, isSeller, deleteProduct);

export default router;