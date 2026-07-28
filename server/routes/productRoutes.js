import express from "express";

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
router.post("/", addProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;