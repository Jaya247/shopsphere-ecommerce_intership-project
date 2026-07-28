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
    // Order Status
    // ======================================

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const processingOrders =
      await Order.countDocuments({
        status: "Processing",
      });

    const shippedOrders =
      await Order.countDocuments({
        status: "Shipped",
      });

    const deliveredOrders =
      await Order.countDocuments({
        status: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        status: "Cancelled",
      });

    // ======================================
    // Low Stock Products
    // ======================================

    const lowStockProducts = await Product.find({
      stock: {
        $lte: 5,
      },
    })
      .sort({
        stock: 1,
      })
      .limit(5);

    // ======================================
    // Category Analytics
    // ======================================

    const categoryAnalytics =
      await Product.aggregate([
        {
          $group: {
            _id: "$category",

            totalProducts: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            totalProducts: -1,
          },
        },
      ]);

    // ======================================
    // Monthly Revenue
    // ======================================

    const monthlyRevenue =
      await Order.aggregate([
        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$totalPrice",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);
          // ======================================
    // Latest Products
    // ======================================

    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ======================================
    // Latest Users
    // ======================================

    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // ======================================
    // Latest Orders
    // ======================================

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