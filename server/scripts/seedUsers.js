import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("Checking and seeding default demo users...");

    // 1. Seed Admin User
    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.create({
        name: "Piyush Dubey",
        email: adminEmail,
        password: hashedPassword,
        role: "Admin",
        isAdmin: true
      });
      console.log("🛡️ Demo Admin User (admin@gmail.com) created!");
    } else {
      console.log("🛡️ Demo Admin User already exists.");
    }

    // 2. Seed Normal User
    const userEmail = "user@gmail.com";
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("user123", salt);

      await User.create({
        name: "Demo Buyer",
        email: userEmail,
        password: hashedPassword,
        role: "User",
        isAdmin: false
      });
      console.log("👤 Demo Normal User (user@gmail.com) created!");
    } else {
      console.log("👤 Demo Normal User already exists.");
    }

    console.log("🎉 User seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
