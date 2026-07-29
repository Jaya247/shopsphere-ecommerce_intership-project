import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBox,
  FaShoppingCart,
  FaRupeeSign,
  FaArrowLeft,
  FaBoxOpen,
  FaPlus,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

import API from "../../api/axios";

// Helper color palette for category distribution
const COLORS = ["#0891b2", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6"];

function SellerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUnitsSold: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  const isDarkMode = document.documentElement.classList.contains("dark");

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/seller/dashboard");
      setAnalytics(data.analytics || {});
      setLowStockProducts(data.lowStockProducts || []);
      setCategoryAnalytics(data.categoryAnalytics || []);
      setLatestOrders(data.latestOrders || []);
      setLatestProducts(data.latestProducts || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load seller metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-350 animate-pulse">
            Loading Seller Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition duration-300">
      
      {/* Seller Header */}
      <div className="bg-slate-900 text-white px-8 py-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          <p className="text-slate-450 mt-1 text-sm">
            Manage your shop, list products, track earnings, and inventory logs
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-cyan-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
        >
          <FaArrowLeft size={12} />
          Back to Store
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* 1. Core Seller Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 flex items-center justify-between transition">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                My Earnings
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                ₹{analytics.totalRevenue.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-950/50 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <FaRupeeSign size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 flex items-center justify-between transition">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                My Products
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalProducts.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-cyan-100 dark:bg-cyan-950/50 p-4 rounded-2xl text-cyan-600 dark:text-cyan-400">
              <FaBox size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 flex items-center justify-between transition">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Units Sold
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalUnitsSold.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-violet-100 dark:bg-violet-950/50 p-4 rounded-2xl text-violet-600 dark:text-violet-400">
              <FaBoxOpen size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 flex items-center justify-between transition">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Vendor Orders
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalOrders.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-orange-100 dark:bg-orange-950/50 p-4 rounded-2xl text-orange-600 dark:text-orange-400">
              <FaShoppingCart size={24} />
            </div>
          </div>

        </div>

        {/* Quick actions for Seller */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 px-5 font-bold transition shadow-md cursor-pointer"
          >
            <FaPlus size={12} /> Add New Product
          </button>
        </div>

        {/* 2. Charts & Inventory Warnings */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-4 text-slate-850 dark:text-white">
                My Inventory Categories
              </h2>
              {categoryAnalytics.length === 0 ? (
                <p className="text-slate-400 text-sm py-10">No products uploaded yet.</p>
              ) : (
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryAnalytics}
                        dataKey="totalProducts"
                        nameKey="_id"
                        outerRadius={90}
                        cx="50%"
                        cy="50%"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {categoryAnalytics.map((item, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                            stroke={isDarkMode ? "#0f172a" : "#fff"}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Warning Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-850 dark:text-white text-red-500">
              Low Stock Alert (Vendor)
            </h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                ✔ All of your items are well stocked! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-350 truncate max-w-[140px]">{p.name}</span>
                    <span className="bg-red-100 text-red-650 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded font-extrabold">
                      Only {p.stock} Left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 3. Latest Addition & Orders Lists */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Latest Products */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-5 text-slate-850 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-3">
              My Products
            </h2>
            {latestProducts.length === 0 ? (
              <p className="text-slate-450 text-sm">No products listed.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-850">
                {latestProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || "https://placehold.co/60?text=No+Image"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100 truncate max-w-[200px]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Stock: {product.stock} units
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-5 text-slate-855 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-3">
              My Product Orders
            </h2>
            {latestOrders.length === 0 ? (
              <p className="text-slate-450 text-sm">No orders matching your items.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-850">
                {latestOrders.map((order) => (
                  <div key={order._id} className="py-3 flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {order.shippingAddress?.fullName || "Guest Order"}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-450 dark:text-slate-550">
                        <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        <span>•</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                          ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-white font-bold text-[10px] uppercase tracking-wide shrink-0 ${
                        order.status === "Delivered"
                          ? "bg-green-600"
                          : order.status === "Cancelled"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;
