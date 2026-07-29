import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ======================================
// Dashboard Analytics
// ======================================
export const getDashboardData = async (req, res) => {
  try {
    // ======================================
    // Counts
    // ======================================
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // ======================================
    // Revenue
    // ======================================
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

    // ======================================
    // Order Status counts
    // ======================================
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const processingOrders = await Order.countDocuments({ status: "Processing" });
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    // ======================================
    // Low Stock Products
    // ======================================
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    })
      .sort({ stock: 1 })
      .limit(5);

    // ======================================
    // Category Product Counts
    // ======================================
    const categoryAnalytics = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
        },
      },
      {
        $sort: { totalProducts: -1 },
      },
    ]);

    // ======================================
    // Monthly Revenue & Sales Volume
    // ======================================
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // ======================================
    // Daily Orders (Last 30 Days)
    // ======================================
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // ======================================
    // Monthly Users Signup Trend
    // ======================================
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          users: { $sum: 1 }
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // ======================================
    // Category Sales (Revenue per Category)
    // ======================================
    const categorySales = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$productDetails.category", "Unknown"] },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
          orders: { $sum: "$orderItems.quantity" }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    // ======================================
    // Latest Logs
    // ======================================
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // ======================================
    // Response
    // ======================================
    res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        orderStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      },
      monthlyRevenue,
      categoryAnalytics,
      dailyOrders,
      monthlyUsers,
      categorySales,
      lowStockProducts,
      latestProducts,
      latestUsers,
      latestOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};