import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  const moveToCart = (item) => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(item._id));
    toast.success(`${item.name} moved to cart 🛒`);
  };

  const removeItem = (item) => {
    dispatch(removeFromWishlist(item._id));
    toast.success(`${item.name} removed from wishlist`);
  };

  const handleClear = () => {
    dispatch(clearWishlist());
    toast.success("Wishlist cleared");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center min-h-[70vh] flex flex-col items-center justify-center transition duration-300 dark:text-white">

        <h1 className="text-6xl animate-pulse">
          ❤️
        </h1>

        <h2 className="text-4xl font-extrabold mt-5 text-slate-800 dark:text-white">
          Your Wishlist is Empty
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-3">
          Save your favourite products here.
        </p>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh] transition duration-300">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">
          My Wishlist ❤️
        </h1>

        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-sm text-sm"
        >
          Clear Wishlist
        </button>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {wishlistItems.map((item) => (

          <div
            key={item._id}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">

                <img
                  src={
                    item.images?.[0] ||
                    item.image ||
                    "https://placehold.co/300?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300?text=No+Image";
                  }}
                />

              </div>

              <h2 className="text-xl font-bold mt-5 text-slate-800 dark:text-white line-clamp-2 leading-snug">
                {item.name}
              </h2>

              <div className="flex items-center justify-between mt-3">
                <p className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                <p className="text-yellow-500 font-semibold text-sm">
                  ⭐ {item.rating}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6"> 
              
              <button
                onClick={() => moveToCart(item)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white py-2.5 rounded-lg font-bold transition cursor-pointer text-sm"
              >
                🛒 Move To Cart
              </button>

              <button
                onClick={() => removeItem(item)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg font-bold transition cursor-pointer text-sm"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;
