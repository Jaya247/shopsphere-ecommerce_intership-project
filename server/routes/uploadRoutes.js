import express from "express";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Upload Image
router.post("/", uploadImage);

export default router;