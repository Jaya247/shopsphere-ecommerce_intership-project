import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);

      setOrder(data.order);
    } catch (error) {
      console.log(error);
      alert("Unable to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-3xl mt-20">
        Order Not Found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Order Details
        </h1>

        <Link
          to="/orders"
          className="bg-slate-900 text-white px-5 py-3 rounded-lg"
        >
          Back
        </Link>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* Customer */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Customer Details
            </h2>

            <p className="mb-3">
              <strong>Name :</strong>{" "}
              {order.user?.name}
            </p>

            <p className="mb-3">
              <strong>Email :</strong>{" "}
              {order.user?.email}
            </p>

            <p>
              <strong>Phone :</strong>{" "}
              {order.shippingAddress?.phone}
            </p>

          </div>

          {/* Shipping */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Shipping Address
            </h2>

            <p>
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

          </div>

          {/* Products */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              Ordered Products
            </h2>

            <div className="space-y-5">

              {order.orderItems.map((item, index) => (

                <div
                  key={index}
                  className="flex gap-5 border-b pb-5"
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

                    <h3 className="text-lg font-bold">
                      {item.name}
                    </h3>

                    <p>
                      Quantity : {item.quantity}
                    </p>

                    <p className="text-cyan-600 font-bold mt-2">
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div>

          <div className="bg-white rounded-xl shadow p-6 sticky top-24">

            <h2 className="text-2xl font-bold mb-5">
              Order Summary
            </h2>
                        <p className="mb-3">
              <strong>Order ID</strong>
              <br />
              {order._id}
            </p>

            <p className="mb-3">
              <strong>Order Date</strong>
              <br />
              {new Date(order.createdAt).toLocaleDateString(
                "en-IN"
              )}
            </p>

            <p className="mb-3">
              <strong>Payment Method</strong>
              <br />
              {order.paymentMethod}
            </p>

            <p className="mb-3">
              <strong>Payment Status</strong>
              <br />
              <span
                className={`font-bold ${
                  order.isPaid
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>

            <p className="mb-3">
              <strong>Order Status</strong>
              <br />
              <span className="font-bold text-blue-600">
                {order.status}
              </span>
            </p>

            <hr className="my-6" />

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Items Price</span>
                <span>
                  ₹
                  {Number(
                    order.itemsPrice
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  ₹
                  {Number(
                    order.shippingPrice
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST</span>
                <span>
                  ₹
                  {Number(
                    order.taxPrice
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span className="text-cyan-600">
                  ₹
                  {Number(
                    order.totalPrice
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-8 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold"
            >
              Print Invoice
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;