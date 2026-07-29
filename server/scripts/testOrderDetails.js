import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Order from "../models/Order.js";

dotenv.config();

await connectDB();

const order = await Order.findOne();
if (!order) {
  console.log("No orders in database to test!");
  process.exit(0);
}

console.log("Found Order ID:", order._id);

// Mock getOrderById request/response
const req = {
  params: { id: order._id.toString() }
};

const res = {
  status: (code) => ({
    json: (data) => {
      console.log("=== API GET ORDER BY ID STATUS ===", code);
      console.log("Order Data:", JSON.stringify(data, null, 2));
      process.exit(0);
    }
  })
};

import { getOrderById } from "../controllers/orderController.js";

try {
  await getOrderById(req, res);
} catch (err) {
  console.error("Error running getOrderById:", err);
  process.exit(1);
}
