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
                      handler: async function (response) {
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

      const { data } =
        await API.post("/orders", {
          user: userId,

          orderItems: cartItems.map(
            (item) => ({
              product: item._id,
              name: item.name,
              image:
                item.images?.[0] || "",
              price: item.price,
              quantity: item.quantity,
            })
          ),

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
    <div className="container py-5">
      <div className="row">
        {/* Shipping Details */}

        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">
                Shipping Address
              </h3>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={address.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Full Address"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h5 className="mt-4 mb-3">
                Payment Method
              </h5>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="cod"
                  checked={
                    paymentMethod === "COD"
                  }
                  onChange={() =>
                    setPaymentMethod("COD")
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="cod"
                >
                  Cash On Delivery
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="razorpay"
                  checked={
                    paymentMethod ===
                    "Razorpay"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "Razorpay"
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="razorpay"
                >
                  Razorpay
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}

        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-4">
                Order Summary
              </h3>

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>

                <span>{totalItems}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>

                <span>₹{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>

                <span>₹{shipping}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (18%)</span>

                <span>₹{tax}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>

                <span>₹{total}</span>
              </div>

              <button
                className="btn btn-dark w-100 mt-4"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Processing..."
                  : paymentMethod ===
                    "Razorpay"
                  ? "Pay with Razorpay"
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;