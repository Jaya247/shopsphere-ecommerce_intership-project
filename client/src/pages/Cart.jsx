import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">

        <h1 className="text-6xl">
          🛒
        </h1>

        <h2 className="text-4xl font-bold mt-5">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-3">
          Add some products to continue shopping.
        </p>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-5 flex items-center gap-5"
            >

              <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">

                <img
                  src={
                    item.images?.[0] ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150";
                  }}
                />

              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {item.name}
                </h2>

                <p className="text-cyan-600 font-semibold mt-2">
                  ₹
                  {Number(item.price).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <div className="flex items-center gap-3 mt-4">

                  <button
                    onClick={() =>
                      dispatch(
                        decreaseQuantity(item._id)
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        increaseQuantity(item._id)
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>

                </div>

                <p className="mt-4 font-semibold">
                  Subtotal :
                  <span className="text-cyan-600">
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </p>

              </div>

              <button
                onClick={() =>
                  dispatch(
                    removeFromCart(item._id)
                  )
                }
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          ))}
                  </div>

        {/* Order Summary */}

        <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-24">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>

            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>

            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>GST (18%)</span>

            <span>
              ₹{tax.toLocaleString("en-IN")}
            </span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span className="text-cyan-600">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>

          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => dispatch(clearCart())}
            className="w-full mt-4 bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 transition"
          >
            Clear Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;