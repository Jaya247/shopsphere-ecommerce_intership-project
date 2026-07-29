import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

useEffect(() => {
  const savedAddress = localStorage.getItem("shippingAddress");

  if (savedAddress) {
    setAddress(JSON.parse(savedAddress));
  }
}, []);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");


  // ===========================
  // Load Razorpay Script
  // ===========================

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ===========================
  // Price Calculation
  // ===========================

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal > 500 ? 0 : 99;

  const tax = Math.round(subtotal * 0.18);

  const total =
    subtotal + shipping + tax;

  // ===========================
  // Handle Inputs
  // ===========================

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]:
        e.target.value,
    });
  };

  // ===========================
  // Razorpay Payment
  // ===========================

  const handleRazorpayPayment =
    async (amount, orderId) => {
      try {
        const { data } =
          await API.post(
            "/payment/create-order",
            {
              amount,
            }
          );

        const options = {
          key:
            import.meta.env
              .VITE_RAZORPAY_KEY_ID,

          amount:
            data.order.amount,

          currency:
            data.order.currency,

          name: "ShopSphere",

          description:
            "Order Payment",

          order_id:
            data.order.id,

          handler: async function (
            response
          ) {
            try {
              await API.post(
                "/payment/verify-payment",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  orderId,
                }
              );

              dispatch(clearCart());

              alert(
                "✅ Payment Successful"
              );

              navigate("/orders");
            } catch (error) {
              console.log(error);

              alert(
                "Payment Verification Failed"
              );
            }
          },

          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },

          notes: {
            address: address.address,
          },

          theme: {
            color: "#0891b2",
          },
        };

        const razorpay =
          new window.Razorpay(options);

        razorpay.open();
      } catch (error) {
        console.log(error);

        alert(
          "Unable to Start Razorpay Payment"
        );
      }
    };
      // ===========================
  // Place Order
  // ===========================

  const placeOrder = async () => {
  // Save Address
  localStorage.setItem(
    "shippingAddress",
    JSON.stringify(address)
  );

  const loginData = JSON.parse(
    localStorage.getItem("user")
  );

  if (!loginData) {
    alert("Please Login First");
    navigate("/login");
    return;
  }

  

    const userId =
      loginData?._id ||
      loginData?.user?._id;

    if (!userId) {
      alert(
        "User ID not found. Please Login Again."
      );

      localStorage.removeItem("user");

      navigate("/login");

      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.email ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert(
        "Please Fill Shipping Address"
      );
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is Empty");
      return;
    }

    try {
      setPlacingOrder(true);

      const { data } = await API.post("/orders", {
        user: userId,

        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || "",
          price: item.price,
          quantity: item.quantity,
        })),

        shippingAddress: address,

        paymentMethod,

        itemsPrice: subtotal,

        shippingPrice: shipping,

        taxPrice: tax,

        totalPrice: total,
      });

      const order = data.order;

      if (paymentMethod === "Razorpay") {
        await handleRazorpayPayment(
          total,
          order._id
        );
      } else {
        dispatch(clearCart());

        alert("✅ Order Placed Successfully");

        navigate("/orders");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Order Failed"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Shipping */}

        <div className="lg:col-span-2 bg-white shadow rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Shipping Address
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
             type="tel"
             name="phone"
             placeholder="Phone"
             value={address.phone}
             maxLength={10}
             onChange={(e) => {
             const value = e.target.value.replace(/\D/g, "").slice(0, 10);

             setAddress({
               ...address,
               phone: value,
                });
            }}
                 className="w-full border rounded-lg p-3"
                />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={address.email}
              onChange={handleChange}
              className="border rounded-lg p-3 md:col-span-2"
            />

            <textarea
              rows="4"
              name="address"
              placeholder="Full Address"
              value={address.address}
              onChange={handleChange}
              className="border rounded-lg p-3 md:col-span-2"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

          <h2 className="text-2xl font-bold mt-10 mb-5">
            Payment Method
          </h2>

          <div className="space-y-3">

            <label className="flex gap-3">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() =>
                  setPaymentMethod("COD")
                }
              />
              Cash On Delivery
            </label>

            <label className="flex gap-3">
              <input
                type="radio"
                checked={
                  paymentMethod === "Razorpay"
                }
                onChange={() =>
                  setPaymentMethod("Razorpay")
                }
              />
              Razorpay
            </label>

          </div>

        </div>
                {/* Order Summary */}

        <div className="bg-white shadow-xl rounded-xl p-6 h-fit sticky top-24">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">

            {cartItems.map((item) => (

              <div
                key={item._id}
                className="flex justify-between border-b pb-3"
              >

                <div>

                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty : {item.quantity}
                  </p>

                </div>

                <span className="font-semibold">
                  ₹
                  {(item.price * item.quantity).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            ))}

          </div>

          <hr className="my-6" />

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>

            <hr />

            <div className="flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span className="text-cyan-600">
                ₹{total.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className={`w-full mt-8 py-4 rounded-xl text-lg font-bold transition ${
              placingOrder
                ? "bg-gray-400 cursor-not-allowed text-white"
                : paymentMethod === "Razorpay"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {placingOrder
              ? "Processing..."
              : paymentMethod === "Razorpay"
              ? "Pay with Razorpay"
              : "Place Order"}
          </button>

          <p className="text-center text-gray-500 mt-5 text-sm">
            🔒 Your payment information is secure.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;