import express from "express";
import { chatAI, generateOutfit } from "../controllers/aiController.js";

const router = express.Router();

// AI Chatbot endpoint
router.post("/chat", chatAI);

// AI Outfit Generator endpoint
router.post("/outfit", generateOutfit);

export default router;
