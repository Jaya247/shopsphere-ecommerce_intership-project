import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  // Redux
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  // Logged User
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Counts
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlistItems.length;

  // Logout
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("✅ Logged Out");

    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-cyan-400 hover:text-cyan-300"
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

          <button className="bg-cyan-500 px-4 py-3 hover:bg-cyan-600">
            <FaSearch />
          </button>

        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">

          <Link to="/">Home</Link>

          <Link to="/products">
            Products
          </Link>

          {/* Admin */}
          {user?.isAdmin && (
            <Link
              to="/admin"
              className="text-yellow-400 font-semibold"
            >
              Admin
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative"
          >
            <FaHeart size={22} />

            <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
          >
            <FaShoppingCart size={22} />

            <span className="absolute -top-2 -right-2 bg-cyan-500 rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <Link to="/orders">
            My Orders
          </Link>

          {/* Login / User */}
          {!user ? (
            <Link
              to="/login"
              className="flex items-center gap-2"
            >
              <FaUser />
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">

              <span className="font-semibold">
                👋 {user.name}
              </span>

              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;