import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import { addToCart } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleWishlist = (e) => {
    e.preventDefault();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden">

        {/* Product Image */}
        <div className="h-52 flex items-center justify-center text-7xl bg-gray-100">
          {product.image}
        </div>

        {/* Product Details */}
        <div className="p-5">

          <span className="text-sm text-cyan-600 font-medium">
            {product.category}
          </span>

          <h3 className="text-xl font-bold mt-2">
            {product.name}
          </h3>

          <div className="flex items-center mt-2 text-yellow-500">
            <FaStar />
            <span className="ml-2 text-gray-700">
              {product.rating}
            </span>
          </div>

          <p className="text-2xl font-bold text-cyan-600 mt-3">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Stock: {product.stock}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-5">

            <button
              onClick={handleCart}
              className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart />
              Cart
            </button>

            <button
              onClick={handleWishlist}
              className={`px-4 rounded-lg transition text-white ${
                isWishlisted
                  ? "bg-red-600"
                  : "bg-gray-500 hover:bg-red-500"
              }`}
            >
              <FaHeart />
            </button>

          </div>

        </div>

      </div>
    </Link>
  );
}

export default ProductCard;