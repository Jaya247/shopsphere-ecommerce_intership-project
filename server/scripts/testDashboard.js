import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

dotenv.config();

await connectDB();

// Mock req, res
const req = {};
const res = {
  status: (code) => ({
    json: (data) => {
      console.log("=== API STATUS ===", code);
      console.log("Analytics:", data.analytics);
      console.log("Daily Orders length:", data.dailyOrders?.length);
      console.log("Monthly Users length:", data.monthlyUsers?.length);
      console.log("Category Sales:", data.categorySales);
      console.log("Low Stock Products length:", data.lowStockProducts?.length);
      process.exit(0);
    }
  })
};

// Import getDashboardData directly
import { getDashboardData } from "../controllers/dashboardController.js";

await getDashboardData(req, res);
