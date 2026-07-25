import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Add Product
router.post("/", addProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProductById);

export default router;