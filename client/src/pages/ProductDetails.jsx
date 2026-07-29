import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../api/axios";

import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      setProduct(data.product);

      if (data.product.images?.length) {
        setSelectedImage(data.product.images[0]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Add To Cart
  const addCartHandler = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: Number(quantity),
      })
    );

    toast.success("Added to Cart! 🛒");
  };

  // Wishlist
  const addWishlistHandler = () => {
    dispatch(addToWishlist(product));

    toast.success("Added to Wishlist! ❤️");
  };

  // Buy Now
  const buyNowHandler = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: Number(quantity),
      })
    );

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl font-bold dark:text-white transition animate-pulse">
        Loading Product Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-2xl font-bold text-red-500">
        Product Not Found 😔
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[80vh] transition duration-300">

      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl p-5 transition duration-300">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[450px] object-contain rounded-xl"
            />
          </div>

          <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl border-2 cursor-pointer object-cover shrink-0 transition ${
                  selectedImage === img
                    ? "border-cyan-500 shadow-md"
                    : "border-gray-300 dark:border-slate-700"
                }`}
              />
            ))}
          </div>

        </div>

        {/* Details */}
        <div>

          <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Brand :
            <span className="font-bold ml-2 text-slate-800 dark:text-slate-200">
              {product.brand}
            </span>
          </p>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Category :
            <span className="font-bold ml-2 text-slate-800 dark:text-slate-200">
              {product.category}
            </span>
          </p>

          <div className="flex items-center mt-4 text-base text-yellow-500 font-semibold">
            ⭐ {product.rating}
            <span className="ml-3 text-slate-500 dark:text-slate-400 text-sm font-normal">
              ({product.numReviews} Reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-4 mt-6">
            <h2 className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </h2>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
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
                : "Out Of Stock"}
            </span>
          </p>

          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Quantity</span>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))
                }
                className="w-20 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 outline-none text-center focus:border-cyan-500 transition"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <button
              onClick={addCartHandler}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition shadow cursor-pointer ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white"
              }`}
            >
              🛒 Add To Cart
            </button>

            <button
              onClick={buyNowHandler}
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-xl font-bold transition shadow cursor-pointer ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-750 text-white dark:bg-green-700 dark:hover:bg-green-600"
              }`}
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={addWishlistHandler}
            className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition shadow cursor-pointer"
          >
            ❤️ Add To Wishlist
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;