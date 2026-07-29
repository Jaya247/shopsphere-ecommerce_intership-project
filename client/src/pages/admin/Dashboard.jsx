import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaArrowLeft,
  FaExclamationTriangle,
  FaChartLine,
  FaUserPlus,
  FaBoxOpen,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import API from "../../api/axios";

// Helper for month names mapping
const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Colorful palettes for Pie Charts
const COLORS = ["#0891b2", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6", "#3b82f6"];

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [latestProducts, setLatestProducts] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Advanced new metrics state
  const [dailyOrders, setDailyOrders] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains("dark");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/dashboard");

      setAnalytics(data.analytics || {});
      setLatestProducts(data.latestProducts || []);
      setLatestUsers(data.latestUsers || []);
      setLatestOrders(data.latestOrders || []);
      setMonthlyRevenue(data.monthlyRevenue || []);
      setCategoryAnalytics(data.categoryAnalytics || []);
      setLowStockProducts(data.lowStockProducts || []);
      
      // New chart data states
      setDailyOrders(data.dailyOrders || []);
      setMonthlyUsers(data.monthlyUsers || []);
      setCategorySales(data.categorySales || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 animate-pulse">
            Loading Analytics Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Pre-process and format chart data
  const formattedMonthlyData = monthlyRevenue.map((item) => ({
    name: monthNames[item._id?.month] || `Month ${item._id?.month}`,
    Revenue: item.revenue || 0,
    Sales: item.orders || 0,
  }));

  const formattedDailyOrders = dailyOrders.map((item) => ({
    date: item._id ? item._id.substring(5) : "", // Show MM-DD format for brevity
    Orders: item.orders || 0,
    Revenue: item.revenue || 0,
  }));

  const formattedMonthlyUsers = monthlyUsers.map((item) => ({
    name: monthNames[item._id?.month] || `Month ${item._id?.month}`,
    Signups: item.users || 0,
  }));

  // Custom premium tooltips
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-750 text-white p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-cyan-400 font-extrabold">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  const CountTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-750 text-white p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-emerald-400 font-extrabold">
            {payload[0].value} {payload[0].name}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition duration-300">
      
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 text-white px-8 py-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
            <FaChartLine className="text-cyan-400" /> Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Realtime shop stats, sales trends, user metrics, and inventory distribution
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
        >
          <FaArrowLeft size={12} />
          Back to Store
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* 1. Core Analytics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Total Orders
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalOrders.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-cyan-100 dark:bg-cyan-950/50 p-4 rounded-2xl text-cyan-600 dark:text-cyan-400">
              <FaShoppingCart size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Products
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalProducts.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-950/50 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <FaBox size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Users
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">
                {analytics.totalUsers.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-orange-100 dark:bg-orange-950/50 p-4 rounded-2xl text-orange-600 dark:text-orange-400">
              <FaUsers size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Total Revenue
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none truncate">
                ₹{Number(analytics.totalRevenue).toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="bg-violet-100 dark:bg-violet-950/50 p-4 rounded-2xl text-violet-600 dark:text-violet-400">
              <FaRupeeSign size={24} />
            </div>
          </div>

        </div>

        {/* 2. Management Quick Links */}
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-slate-800 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="bg-cyan-600 hover:bg-cyan-550 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white rounded-xl py-3 px-6 text-center font-bold transition duration-250 cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              Manage Products
            </button>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="bg-green-600 hover:bg-green-550 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl py-3 px-6 text-center font-bold transition duration-250 cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-orange-500 hover:bg-orange-550 dark:bg-orange-600 dark:hover:bg-orange-500 text-white rounded-xl py-3 px-6 text-center font-bold transition duration-250 cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              Manage Orders
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-violet-600 hover:bg-violet-550 dark:bg-violet-750 dark:hover:bg-violet-650 text-white rounded-xl py-3 px-6 text-center font-bold transition duration-250 cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* 3. Primary Charts: Sales & Revenue Trends */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Revenue Trend (Area Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaRupeeSign className="text-cyan-500" /> Monthly Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formattedMonthlyData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#0891b2"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Sales volume (Bar Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaShoppingCart className="text-emerald-500" /> Monthly Sales Volume
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formattedMonthlyData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip content={<CountTooltip />} />
                <Bar
                  dataKey="Sales"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* 4. Second Row Charts: Daily Activity & User Signups */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Chart 3: Daily Orders (Line Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaChartLine className="text-cyan-500" /> Daily Orders (Last 30 Days)
            </h2>
            {formattedDailyOrders.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No orders registered in the last 30 days.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedDailyOrders} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />
                  <Tooltip content={<CountTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Orders"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Chart 4: Users Signups Trend (Bar Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaUserPlus className="text-orange-500" /> User Acquisition Trend
            </h2>
            {formattedMonthlyUsers.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No user registrations found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedMonthlyUsers} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />
                  <Tooltip content={<CountTooltip />} />
                  <Bar
                    dataKey="Signups"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* 5. Inventory & Revenue Contribution (Pie Charts) */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Chart 5: Category Product Share (Pie Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaBoxOpen className="text-violet-500" /> Products by Category
            </h2>
            {categoryAnalytics.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No categories found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryAnalytics}
                    dataKey="totalProducts"
                    nameKey="_id"
                    outerRadius={100}
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
            )}
          </div>

          {/* Chart 6: Category Revenue Contribution (Pie Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <FaRupeeSign className="text-violet-500" /> Revenue by Category
            </h2>
            {categorySales.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No sales generated yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySales}
                    dataKey="revenue"
                    nameKey="_id"
                    outerRadius={100}
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categorySales.map((item, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[(index + 2) % COLORS.length]}
                        stroke={isDarkMode ? "#0f172a" : "#fff"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* 6. Low Stock Warning Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaExclamationTriangle className="text-red-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Low Stock Warnings
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4 text-green-700 dark:text-green-400 font-semibold text-sm">
              ✔ Great job! All product stocks are in healthy levels. 🎉
            </div>
          ) : (
            <div className="border border-red-100 dark:border-red-950/40 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-4 bg-red-50/30 dark:bg-red-950/10 text-sm"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {product.name}
                  </span>
                  <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 px-3 py-1 rounded-lg font-extrabold">
                    Only {product.stock} Left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Latest Logs */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Latest Products */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5 text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-3">
              Latest Additions
            </h2>
            {latestProducts.length === 0 ? (
              <p className="text-slate-400 text-sm">No products added yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-850">
                {latestProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 py-3">
                    <img
                      src={product.images?.[0] || "https://placehold.co/60?text=No+Image"}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border dark:border-slate-750"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Users */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5 text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-3">
              New Signups
            </h2>
            {latestUsers.length === 0 ? (
              <p className="text-slate-400 text-sm">No users registered.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-850">
                {latestUsers.map((user) => (
                  <div key={user._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-805 dark:text-slate-100 truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-white font-bold text-[10px] uppercase tracking-wide shrink-0 ${
                        user.isAdmin ? "bg-green-600" : "bg-slate-500 dark:bg-slate-750"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Orders */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5 text-slate-850 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-3">
              Recent Activity
            </h2>
            {latestOrders.length === 0 ? (
              <p className="text-slate-400 text-sm">No orders received.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-855">
                {latestOrders.map((order) => (
                  <div key={order._id} className="py-3 flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-805 dark:text-slate-100 truncate">
                        {order.shippingAddress?.fullName || "Guest Order"}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 dark:text-slate-500">
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

export default Dashboard;