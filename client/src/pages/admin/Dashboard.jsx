import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import API from "../../api/axios";

function Dashboard() {
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

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/dashboard");

      setAnalytics(data.analytics);
      setLatestProducts(data.latestProducts);
      setLatestUsers(data.latestUsers);
      setLatestOrders(data.latestOrders);

      setMonthlyRevenue(data.monthlyRevenue);
      setCategoryAnalytics(data.categoryAnalytics);
      setLowStockProducts(data.lowStockProducts);
    } catch (error) {
      console.log(error);
      alert("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-slate-900 text-white px-8 py-6 shadow">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-300 mt-2">
          Welcome to ShopSphere Admin Panel
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <FaShoppingCart className="text-4xl text-cyan-500" />

            <h2 className="text-3xl font-bold mt-4">
              {analytics.totalOrders}
            </h2>

            <p className="text-gray-500">
              Total Orders
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaBox className="text-4xl text-green-600" />

            <h2 className="text-3xl font-bold mt-4">
              {analytics.totalProducts}
            </h2>

            <p className="text-gray-500">
              Products
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaUsers className="text-4xl text-orange-500" />

            <h2 className="text-3xl font-bold mt-4">
              {analytics.totalUsers}
            </h2>

            <p className="text-gray-500">
              Users
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaRupeeSign className="text-4xl text-purple-600" />

            <h2 className="text-3xl font-bold mt-4">
              ₹
              {Number(
                analytics.totalRevenue
              ).toLocaleString("en-IN")}
            </h2>

            <p className="text-gray-500">
              Revenue
            </p>
          </div>

        </div>

        {/* Quick Actions */}

        <h2 className="text-3xl font-bold mt-12 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Link
            to="/admin/products"
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl p-6 text-center font-bold text-xl transition"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/add-product"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-center font-bold text-xl transition"
          >
            Add Product
          </Link>

          <Link
            to="/admin/orders"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-center font-bold text-xl transition"
          >
            Manage Orders
          </Link>

          <Link
            to="/admin/users"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-6 text-center font-bold text-xl transition"
          >
            Manage Users
          </Link>

        </div>
        
        {/* ========================= */}
{/* Charts Section */}
{/* ========================= */}

<div className="grid lg:grid-cols-2 gap-8 mt-12">

  {/* Revenue Chart */}

  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-6">
      Monthly Revenue
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <BarChart data={monthlyRevenue}>

        <XAxis dataKey="_id.month" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="revenue"
          fill="#06b6d4"
          radius={[8,8,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* Category Chart */}

  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-6">
      Products by Category
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={categoryAnalytics}
          dataKey="totalProducts"
          nameKey="_id"
          outerRadius={110}
          label
        >

          {categoryAnalytics.map((item,index)=>(

            <Cell
              key={index}
              fill={[
                "#06b6d4",
                "#22c55e",
                "#f97316",
                "#8b5cf6",
                "#ef4444",
                "#14b8a6",
              ][index % 6]}
            />

          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>

{/* ========================= */}
{/* Low Stock */}
{/* ========================= */}

<div className="bg-white rounded-xl shadow p-6 mt-10">

  <h2 className="text-2xl font-bold mb-5">
    Low Stock Products
  </h2>

  {lowStockProducts.length===0 ? (

    <p className="text-green-600">
      No Low Stock Products 🎉
    </p>

  ) : (

    lowStockProducts.map((product)=>(

      <div
        key={product._id}
        className="flex justify-between border-b py-3"
      >

        <span>{product.name}</span>

        <span className="font-bold text-red-600">
          {product.stock}
        </span>

      </div>

    ))

  )}

</div>
{/* ========================= */}
{/* Latest Data */}
{/* ========================= */}

<div className="grid lg:grid-cols-3 gap-8 mt-12">

  {/* Latest Products */}

  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-5">
      Latest Products
    </h2>

    {latestProducts.length === 0 ? (

      <p>No Products</p>

    ) : (

      latestProducts.map((product) => (

        <div
          key={product._id}
          className="flex items-center gap-3 border-b py-3"
        >

          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/60"
            }
            alt={product.name}
            className="w-14 h-14 rounded-lg object-cover"
          />

          <div className="flex-1">

            <h3 className="font-semibold">
              {product.name}
            </h3>

            <p className="text-sm text-gray-500">
              ₹{product.price}
            </p>

          </div>

        </div>

      ))

    )}

  </div>

  {/* Latest Users */}

  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-5">
      Latest Users
    </h2>

    {latestUsers.length === 0 ? (

      <p>No Users</p>

    ) : (

      latestUsers.map((user) => (

        <div
          key={user._id}
          className="border-b py-3"
        >

          <h3 className="font-semibold">
            {user.name}
          </h3>

          <p className="text-sm text-gray-500">
            {user.email}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-xs ${
              user.isAdmin
                ? "bg-green-600"
                : "bg-slate-600"
            }`}
          >
            {user.isAdmin ? "Admin" : "User"}
          </span>

        </div>

      ))

    )}

  </div>

  {/* Latest Orders */}

  <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-5">
      Latest Orders
    </h2>

    {latestOrders.length === 0 ? (

      <p>No Orders</p>

    ) : (

      latestOrders.map((order) => (

        <div
          key={order._id}
          className="border-b py-3"
        >

          <h3 className="font-semibold">
            {order.shippingAddress?.fullName}
          </h3>

          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>

          <p className="font-bold text-cyan-600 mt-1">
            ₹{Number(order.totalPrice).toLocaleString("en-IN")}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-xs ${
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

      ))

    )}

  </div>

</div>

</div>

</div>
);
}

export default Dashboard;