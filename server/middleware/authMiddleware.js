import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and assign to req.user
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found with this token",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Invalid Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, No Token",
    });
  }
};

// Role authorization checks
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Require Admin Role",
    });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === "Seller" || req.user.role === "Admin")) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Require Seller Role",
    });
  }
};

export const isManager = (req, res, next) => {
  if (req.user && (req.user.role === "Manager" || req.user.role === "Admin")) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Require Manager Role",
    });
  }
};

export default protect;