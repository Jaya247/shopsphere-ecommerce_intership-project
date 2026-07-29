import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ======================================
// Seller Dashboard Analytics
// ======================================
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Fetch Seller Products
    const sellerProducts = await Product.find({ seller: sellerId });
    const totalProducts = sellerProducts.length;
    const productIds = sellerProducts.map((p) => p._id);

    // 2. Fetch Orders containing Seller's Products
    const sellerOrders = await Order.find({
      "orderItems.product": { $in: productIds },
    }).populate("user", "name email");

    const totalOrders = sellerOrders.length;

    // 3. Calculate Seller Revenue and Sales units
    let totalRevenue = 0;
    let totalUnitsSold = 0;

    sellerOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (productIds.some((pid) => pid.toString() === item.product.toString())) {
          totalRevenue += item.price * item.quantity;
          totalUnitsSold += item.quantity;
        }
      });
    });

    // 4. Low stock products for this seller
    const lowStockProducts = sellerProducts.filter((p) => p.stock <= 5);

    // 5. Category distribution for this seller
    const categories = {};
    sellerProducts.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    const categoryAnalytics = Object.keys(categories).map((cat) => ({
      _id: cat,
      totalProducts: categories[cat],
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalUnitsSold,
      },
      lowStockProducts,
      categoryAnalytics,
      latestOrders: sellerOrders.slice(0, 5),
      latestProducts: sellerProducts.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Seller Products
// ======================================
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Seller Orders
// ======================================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map((p) => p._id);

    const orders = await Order.find({
      "orderItems.product": { $in: productIds },
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
