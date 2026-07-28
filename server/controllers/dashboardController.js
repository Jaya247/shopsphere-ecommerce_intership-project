import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ======================================
// Dashboard Analytics
// ======================================
export const getDashboardData = async (req, res) => {
  try {
    // Counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Latest Products
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest Users
    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest Orders
    const latestOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,

      analytics: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
      },

      latestProducts,
      latestUsers,
      latestOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};