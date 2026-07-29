import { useDispatch, useSelector } from "react-redux";
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

    alert("✅ Product moved to cart");
  };

  const removeItem = (id) => {
    dispatch(removeFromWishlist(id));

    alert("✅ Product removed from wishlist");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">

        <h1 className="text-6xl">
          ❤️
        </h1>

        <h2 className="text-4xl font-bold mt-5">
          Your Wishlist is Empty
        </h2>

        <p className="text-gray-500 mt-3">
          Save your favourite products here.
        </p>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          My Wishlist ❤️
        </h1>

        <button
          onClick={() => dispatch(clearWishlist())}
          className="bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600"
        >
          Clear Wishlist
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {wishlistItems.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md p-5"
          >

            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">

              <img
                src={
                  item.images?.[0] ||
                  "https://via.placeholder.com/300"
                }
                alt={item.name}
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300";
                }}
              />

            </div>

            <h2 className="text-2xl font-bold mt-5">
              {item.name}
            </h2>

            <p className="text-cyan-600 font-semibold mt-2">
              ₹{Number(item.price).toLocaleString("en-IN")}
            </p>

            <p className="text-yellow-500 mt-2">
              ⭐ {item.rating}
            </p>

            <div className="flex gap-3 mt-6"> 
        
            
             <button
                onClick={() => moveToCart(item)}
                className="flex-1 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition"
              >
                🛒 Move To Cart
              </button>

              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600 transition"
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
            
