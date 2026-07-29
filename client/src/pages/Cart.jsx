import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/slices/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

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

  const totalPrice =
    subtotal + shipping + tax;

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`Removed ${name} from cart`);
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center min-h-[70vh] flex flex-col items-center justify-center transition duration-300 dark:text-white">

        <h1 className="text-6xl animate-bounce">
          🛒
        </h1>

        <h2 className="text-4xl font-extrabold mt-5 text-slate-800 dark:text-white">
          Your Cart is Empty
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-3">
          Add some products to continue shopping.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer shadow-md"
        >
          Shop Now
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh] transition duration-300">

      <h1 className="text-4xl font-extrabold mb-8 text-slate-800 dark:text-white">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-md p-5 flex flex-col sm:flex-row items-center gap-5 transition"
            >

              <div className="w-28 h-28 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">

                <img
                  src={
                    item.images?.[0] ||
                    item.image ||
                    "https://placehold.co/150?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/150?text=No+Image";
                  }}
                />

              </div>

              <div className="flex-1 text-center sm:text-left">

                <h2 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 leading-snug">
                  {item.name}
                </h2>

                <p className="text-cyan-600 dark:text-cyan-400 font-bold mt-2">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">

                  <button
                    onClick={() =>
                      dispatch(
                        decreaseQuantity(item._id)
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-white font-bold transition flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold w-6 text-center text-slate-800 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        increaseQuantity(item._id)
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-white font-bold transition flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>

                </div>

                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Subtotal :{" "}
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold text-base">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </p>

              </div>

              <button
                onClick={() => handleRemove(item._id, item.name)}
                className="bg-red-500 hover:bg-red-650 text-white font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-sm text-sm shrink-0 mt-3 sm:mt-0"
              >
                Remove
              </button>

            </div>

          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl p-6 h-fit sticky top-24 transition duration-300">

          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4 text-slate-650 dark:text-slate-350">
            <span>Total Items</span>
            <span className="font-bold">{totalItems}</span>
          </div>

          <div className="flex justify-between mb-4 text-slate-655 dark:text-slate-350">
            <span>Subtotal</span>
            <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between mb-4 text-slate-655 dark:text-slate-350">
            <span>Shipping</span>
            <span className="font-bold">
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>
          </div>

          <div className="flex justify-between mb-4 text-slate-655 dark:text-slate-350">
            <span>GST (18%)</span>
            <span className="font-bold">₹{tax.toLocaleString("en-IN")}</span>
          </div>

          <hr className="my-5 border-gray-250 dark:border-slate-800" />

          <div className="flex justify-between text-2xl font-extrabold text-slate-800 dark:text-white">
            <span>Total</span>
            <span className="text-cyan-600 dark:text-cyan-400">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-4 rounded-xl font-bold transition shadow cursor-pointer text-center"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handleClear}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition shadow cursor-pointer text-center"
          >
            Clear Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;