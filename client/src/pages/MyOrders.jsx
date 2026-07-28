import { useEffect, useState } from "react";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders");
        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading Orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">
          No Orders Found 📦
        </h1>

        <p className="text-gray-500 mt-3">
          Place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      <div className="space-y-8">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-xl shadow-lg p-6"
          >

            <div className="flex flex-col md:flex-row justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Order ID
                </h2>

                <p className="text-gray-500 break-all">
                  {order._id}
                </p>

                <p className="mt-3">
                  Payment :
                  <span className="font-semibold">
                    {" "}
                    {order.paymentMethod}
                  </span>
                </p>

                <p className="mt-2">
                  Total :
                  <span className="font-bold text-cyan-600">
                    {" "}
                    ₹
                    {Number(order.totalPrice).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </p>

              </div>

              <div className="mt-5 md:mt-0">

                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    order.isPaid
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>

                <span
                  className={`ml-3 px-4 py-2 rounded-full text-white ${
                    order.isDelivered
                      ? "bg-blue-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.isDelivered
                    ? "Delivered"
                    : "Pending"}
                </span>

              </div>

            </div>

            <hr className="my-6" />

            <h3 className="text-xl font-bold mb-4">
              Products
            </h3>

            <div className="space-y-4">

              {order.orderItems.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-5"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain bg-gray-100 rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150";
                    }}
                  />

                  <div>

                    <h4 className="font-bold">
                      {item.name}
                    </h4>

                    <p>
                      Qty : {item.quantity}
                    </p>

                    <p className="text-cyan-600 font-semibold">
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <hr className="my-6" />

            <h3 className="text-xl font-bold">
              Shipping Address
            </h3>

            <p className="mt-3">
              {order.shippingAddress?.fullName}
            </p>

            <p>
              {order.shippingAddress?.address}
            </p>

            <p>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state}
            </p>

            <p>
              {order.shippingAddress?.pincode}
            </p>

            <p className="mt-2">
              📞 {order.shippingAddress?.phone}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyOrders;