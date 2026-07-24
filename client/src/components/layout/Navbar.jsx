import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUser,
} from "react-icons/fa";

function Navbar() {
  // Redux Cart
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Redux Wishlist
  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  // Cart Count
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Wishlist Count
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-cyan-400 hover:text-cyan-300 transition"
        >
          ShopSphere 🚀
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center bg-white rounded-lg overflow-hidden w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 text-black outline-none"
          />

          <button className="bg-cyan-500 px-4 py-3 hover:bg-cyan-600 transition">
            <FaSearch />
          </button>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-6 text-lg">

          <Link
            to="/"
            className="hover:text-cyan-400 transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-cyan-400 transition"
          >
            Products
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hover:text-cyan-400 transition"
          >
            <FaHeart size={22} />

            <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {wishlistCount}
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-cyan-400 transition"
          >
            <FaShoppingCart size={22} />

            <span className="absolute -top-2 -right-2 bg-cyan-500 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {cartCount}
            </span>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="hidden md:flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <FaUser />
            Login
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;