import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const loggedUser = useSelector((state) => state.auth.user);

  const [placingOrder, setPlacingOrder] = useState(false);

  // Shipping Address Form
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Coupon state variables
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ===========================
  // Load Razorpay Script
  // ===========================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ===========================
  // Price Calculations
  // ===========================
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);

  // ===========================
  // Handle Coupon Apply
  // ===========================
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a promo code");
      return;
    }
    try {
      const { data } = await API.post("/coupons/apply", {
        code: couponCode,
        cartItems: cartItems.map((item) => ({
          _id: item._id,
          price: item.price,
          quantity: item.quantity,
        })),
        cartTotal: subtotal,
      });

      setAppliedCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
      });
      setDiscountAmount(data.discountAmount);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setDiscountAmount(0);
    toast.success("Coupon code removed");
  };

  // ===========================
  // Handle Inputs
  // ===========================
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Razorpay Payment
  // ===========================
  const handleRazorpayPayment = async (amount, orderId) => {
    try {
      const { data } = await API.post("/payment/create-order", {
        amount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ShopSphere",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await API.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            dispatch(clearCart());
            toast.success("Payment Successful! 🎉");
            navigate("/orders");
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Unable to Start Razorpay Payment");
    }
  };

  // ===========================
  // Place Order
  // ===========================
  const placeOrder = async () => {
    // Save Address
    localStorage.setItem("shippingAddress", JSON.stringify(address));

    if (!loggedUser) {
      toast.error("Please Login First");
      navigate("/login");
      return;
    }

    const userId = loggedUser?._id;

    if (!userId) {
      toast.error("Session invalid. Please login again.");
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
      toast.error("Please fill in all shipping fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      const { data } = await API.post("/orders", {
        user: userId,
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || item.image || "",
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
        await handleRazorpayPayment(total, order._id);
      } else {
        dispatch(clearCart());
        toast.success("Order Placed Successfully! 📦");
        navigate("/orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Order Failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh] transition duration-300">
      <h1 className="text-4xl font-extrabold mb-10 text-slate-800 dark:text-white">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl p-8 transition duration-300">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
            Shipping Address
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
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
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={address.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 md:col-span-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />

            <textarea
              rows="4"
              name="address"
              placeholder="Full Street Address"
              value={address.address}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 md:col-span-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-sm"
            />
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-5 text-slate-800 dark:text-white">
            Payment Method
          </h2>

          <div className="space-y-3 text-slate-700 dark:text-slate-350">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="w-4 h-4 accent-cyan-500"
              />
              Cash On Delivery
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "Razorpay"}
                onChange={() => setPaymentMethod("Razorpay")}
                className="w-4 h-4 accent-cyan-500"
              />
              Razorpay Secure Checkout
            </label>
          </div>
        </div>

        {/* Order Summary card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl p-6 h-fit sticky top-24 transition duration-300">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 mb-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-3"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm pl-4">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Promo Code Input Block */}
          <div className="border-t border-b border-gray-100 dark:border-slate-800 py-4 my-4 space-y-2">
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. BOGO)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none uppercase font-bold"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 px-3 py-2 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono tracking-wider uppercase mr-1.5">{appliedCoupon.code}</span>
                  <span className="text-slate-450 dark:text-slate-400">applied</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-750 font-bold cursor-pointer transition text-xs"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 text-slate-650 dark:text-slate-350 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{tax.toLocaleString("en-IN")}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-650 dark:text-green-400 font-bold">
                <span>Coupon Discount</span>
                <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <hr className="border-gray-100 dark:border-slate-800 my-4" />

            <div className="flex justify-between text-2xl font-extrabold text-slate-800 dark:text-white">
              <span>Total</span>
              <span className="text-cyan-600 dark:text-cyan-400">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className={`w-full mt-8 py-4 rounded-xl text-lg font-bold transition shadow cursor-pointer text-center text-white ${
              placingOrder
                ? "bg-gray-400 cursor-not-allowed"
                : paymentMethod === "Razorpay"
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-green-600 hover:bg-green-750 text-white dark:bg-green-700 dark:hover:bg-green-600"
            }`}
          >
            {placingOrder
              ? "Processing..."
              : paymentMethod === "Razorpay"
              ? "Pay with Razorpay"
              : "Place Order"}
          </button>

          <p className="text-center text-slate-400 dark:text-slate-500 mt-5 text-xs font-semibold">
            🔒 Your payment information is 100% secure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;