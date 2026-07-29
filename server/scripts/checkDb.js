import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

await connectDB();

const products = await Product.find().limit(3);
console.log("=== DB PRODUCTS ===");
console.log(JSON.stringify(products, null, 2));
process.exit(0);
