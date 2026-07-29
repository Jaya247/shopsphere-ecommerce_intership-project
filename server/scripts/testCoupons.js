import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Coupon from "../models/Coupon.js";

dotenv.config();

await connectDB();

// Clear test coupons if any
await Coupon.deleteMany({ code: { $in: ["TEST10", "FLAT200", "BOGO_TEST"] } });

// Create test coupons
const c1 = await Coupon.create({
  code: "TEST10",
  discountType: "Percentage",
  discountValue: 10,
  minPurchase: 1000,
  expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
});

const c2 = await Coupon.create({
  code: "FLAT200",
  discountType: "Flat",
  discountValue: 200,
  minPurchase: 1000,
  expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

const c3 = await Coupon.create({
  code: "BOGO_TEST",
  discountType: "BOGO",
  minPurchase: 500,
  expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

console.log("Created test coupons successfully.");

// Mock applyCoupon request/response
import { applyCoupon } from "../controllers/couponController.js";

const testCases = [
  {
    name: "Valid Percentage Coupon Above Min Purchase",
    req: { body: { code: "TEST10", cartItems: [], cartTotal: 1500 } }
  },
  {
    name: "Invalid Percentage Coupon Below Min Purchase",
    req: { body: { code: "TEST10", cartItems: [], cartTotal: 500 } }
  },
  {
    name: "Valid BOGO Coupon With 2 Quantities",
    req: { body: { code: "BOGO_TEST", cartItems: [{ _id: "prod1", price: 300, quantity: 2 }], cartTotal: 600 } }
  },
  {
    name: "Invalid BOGO Coupon With 1 Quantity",
    req: { body: { code: "BOGO_TEST", cartItems: [{ _id: "prod1", price: 300, quantity: 1 }], cartTotal: 300 } }
  }
];

for (const tc of testCases) {
  console.log(`\n--- Running Test: ${tc.name} ---`);
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log(`Status: ${code}`);
        console.log("Response:", JSON.stringify(data, null, 2));
      }
    })
  };
  await applyCoupon(tc.req, res);
}

process.exit(0);
