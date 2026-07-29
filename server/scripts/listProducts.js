import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

await connectDB();

const categories = await Product.distinct("category");
console.log("Distinct Categories:", categories);

const sample = await Product.find({}, "name category").limit(20);
console.log("Sample Products:", sample);

process.exit(0);
