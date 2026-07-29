import dotenv from "dotenv";
import { generateOutfit } from "../controllers/aiController.js";

dotenv.config();

// Mock request/response
const req = {
  body: {
    shirtColor: "White",
    shirtStyle: "Casual Linen",
    shirtImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
  }
};

const res = {
  status: (code) => ({
    json: (data) => {
      console.log("=== API OUTFIT GENERATOR STATUS ===", code);
      console.log("Outfit Data:", JSON.stringify(data, null, 2));
      process.exit(0);
    }
  })
};

try {
  await generateOutfit(req, res);
} catch (err) {
  console.error("Error running generateOutfit:", err);
  process.exit(1);
}
