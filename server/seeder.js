import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import products from "./data/products.js";

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Delete Old Products
    await Product.deleteMany();

    console.log("🗑 Old Products Deleted");

    // Insert New Products
    await Product.insertMany(products);

    console.log(`✅ ${products.length} Products Imported Successfully`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();