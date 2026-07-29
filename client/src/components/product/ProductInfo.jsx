import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../redux/slices/cartSlice";
import QuantitySelector from "./QuantitySelector";

function ProductInfo({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const discount = product.discount || 0;

  const originalPrice =
    discount > 0
      ? Math.round(Number(product.price) / (1 - discount / 100))
      : Number(product.price);

  return (
    <div className="text-slate-800 dark:text-slate-200">
      {/* Category */}
      <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg uppercase tracking-wider">
        {product.category}
      </span>

      {/* Brand */}
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
        Brand:{" "}
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {product.brand}
        </span>
      </p>

      {/* Product Name */}
      <h1 className="text-4xl font-extrabold mt-3 text-slate-900 dark:text-white leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-4 text-sm font-semibold">
        <span className="text-yellow-500 text-xl">⭐</span>
        <span className="text-slate-850 dark:text-slate-100">{product.rating || 4.5}</span>
        <span className="text-slate-400 dark:text-slate-500 font-normal">
          ({product.numReviews || 0} Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-4">
        <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>

        {discount > 0 && (
          <>
            <span className="text-xl text-slate-400 dark:text-slate-500 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>

            <span className="bg-red-100 dark:bg-red-950/50 text-red-650 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock */}
      <p className="mt-5 text-sm text-slate-550 dark:text-slate-400">
        Stock :
        <span
          className={`font-bold ml-2 text-base ${
            product.stock > 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {product.stock > 0
            ? `${product.stock} Available`
            : "Out of Stock"}
        </span>
      </p>

      {/* Quantity */}
      <QuantitySelector />

      {/* Delivery */}
      <div className="mt-8 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <p>🚚 FREE Delivery Tomorrow</p>
        <p>🛡️ 1 Year Warranty</p>
        <p>🔄 7 Days Replacement</p>
        <p>💳 Secure Payment</p>
        <p>💵 Cash on Delivery Available</p>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Product Description
        </h2>

        <p className="text-slate-650 dark:text-slate-350 leading-relaxed mt-3">
          {product.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-5 mt-8">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 py-4 rounded-xl text-lg font-bold transition shadow cursor-pointer ${
            product.stock > 0
              ? "bg-cyan-500 hover:bg-cyan-600 text-white"
              : "bg-gray-300 text-gray-550 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
          }`}
        >
          🛒 Add to Cart
        </button>

        <button
          disabled={product.stock === 0}
          className={`flex-1 py-4 rounded-xl text-lg font-bold transition shadow cursor-pointer ${
            product.stock > 0
              ? "bg-green-600 hover:bg-green-750 text-white dark:bg-green-700 dark:hover:bg-green-600"
              : "bg-gray-300 text-gray-550 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;