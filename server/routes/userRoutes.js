import express from "express";

import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ======================================
// Get All Users
// ======================================
router.get("/", getUsers);

// ======================================
// Get Single User
// ======================================
router.get("/:id", getUserById);

// ======================================
// Make / Remove Admin
// ======================================
router.put("/:id/role", updateUserRole);

// ======================================
// Delete User
// ======================================
router.delete("/:id", deleteUser);

export default router;