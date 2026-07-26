import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import QuantitySelector from "./QuantitySelector";

function ProductInfo({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart 🛒`);
  };

  const discount = product.discount || 0;

  const originalPrice =
    discount > 0
      ? Math.round(Number(product.price) / (1 - discount / 100))
      : Number(product.price);

  return (
    <div>
      {/* Category */}
      <span className="text-cyan-600 font-semibold text-lg">
        {product.category}
      </span>

      {/* Brand */}
      <p className="text-gray-600 mt-2">
        Brand:{" "}
        <span className="font-semibold">
          {product.brand}
        </span>
      </p>

      {/* Product Name */}
      <h1 className="text-5xl font-bold mt-3">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-yellow-500 text-2xl">⭐</span>

        <span className="text-lg font-semibold">
          {product.rating || 4.5}
        </span>

        <span className="text-gray-500">
          ({product.numReviews || 0} Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-5xl font-bold text-cyan-600">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>

        {discount > 0 && (
          <>
            <span className="text-2xl text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>

            <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock */}
      <p className="mt-5 text-lg">
        Stock :
        <span
          className={`font-bold ${
            product.stock > 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {" "}
          {product.stock > 0
            ? `${product.stock} Available`
            : "Out of Stock"}
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
          {product.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-5 mt-8">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 py-4 rounded-xl text-lg font-semibold transition ${
            product.stock > 0
              ? "bg-cyan-500 hover:bg-cyan-600 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          🛒 Add to Cart
        </button>

        <button
          disabled={product.stock === 0}
          className={`flex-1 py-4 rounded-xl text-lg font-semibold transition ${
            product.stock > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;