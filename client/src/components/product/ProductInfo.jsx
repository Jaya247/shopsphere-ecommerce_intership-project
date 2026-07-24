import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import QuantitySelector from "./QuantitySelector";

function ProductInfo({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart 🛒`);
  };

  const originalPrice = Math.round(product.price * 1.2);

  const discount = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  return (
    <div>
      {/* Category */}
      <span className="text-cyan-600 font-semibold text-lg">
        {product.category}
      </span>

      {/* Product Name */}
      <h1 className="text-5xl font-bold mt-3">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-yellow-500 text-2xl">⭐</span>

        <span className="text-lg font-semibold">
          {product.rating}
        </span>

        <span className="text-gray-500">
          (2,348 Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-5xl font-bold text-cyan-600">
          ₹{product.price.toLocaleString("en-IN")}
        </span>

        <span className="text-2xl text-gray-400 line-through">
          ₹{originalPrice.toLocaleString("en-IN")}
        </span>

        <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
          {discount}% OFF
        </span>
      </div>

      {/* Stock */}
      <p className="mt-5 text-lg">
        Stock :
        <span className="text-green-600 font-bold">
          {" "}
          {product.stock} Available
        </span>
      </p>

      {/* Quantity */}
      <QuantitySelector />

      {/* Delivery */}
      <div className="mt-8 bg-gray-100 rounded-xl p-5 space-y-3">
        <p>🚚 FREE Delivery Tomorrow</p>
        <p>🛡️ 1 Year Warranty</p>
        <p>🔄 7 Days Replacement</p>
        <p>💳 Secure Payment</p>
        <p>💵 Cash on Delivery Available</p>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">
          Product Description
        </h2>

        <p className="text-gray-600 leading-8 mt-3">
          This premium quality product offers excellent
          performance, durability and a modern design.
          Built with high-quality materials, it is perfect
          for everyday use and long-term reliability.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-5 mt-8">

        <button
          onClick={handleAddToCart}
          className="flex-1 bg-cyan-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-cyan-600 transition"
        >
          🛒 Add to Cart
        </button>

        <button className="flex-1 bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
          Buy Now
        </button>

      </div>
    </div>
  );
}

export default ProductInfo;