import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";

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

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/dashboard");

      setAnalytics(data.analytics);
      setLatestProducts(data.latestProducts);
      setLatestUsers(data.latestUsers);
      setLatestOrders(data.latestOrders);
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

        {/* Latest Products */}

        <div className="grid lg:grid-cols-3 gap-8 mt-14">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Latest Products
            </h2>

            {latestProducts.map((product) => (
              <div
                key={product._id}
                className="border-b py-2"
              >
                {product.name}
              </div>
            ))}

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Latest Users
            </h2>

            {latestUsers.map((user) => (
              <div
                key={user._id}
                className="border-b py-2"
              >
                {user.name}
              </div>
            ))}

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Latest Orders
            </h2>

            {latestOrders.map((order) => (
              <div
                key={order._id}
                className="border-b py-2"
              >
                {order.shippingAddress?.fullName}
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;