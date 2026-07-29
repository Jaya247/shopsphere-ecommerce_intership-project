import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaMicrophone,
  FaBars,
  FaTimes,
  FaHome,
  FaBox,
  FaListAlt,
} from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Drawer slider state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic header background image list
  const [headerBg, setHeaderBg] = useState("");
  
  const bgImages = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80"
  ];

  useEffect(() => {
    // Select a random background image on mount/refresh
    const randomIdx = Math.floor(Math.random() * bgImages.length);
    setHeaderBg(bgImages[randomIdx]);
  }, []);

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Redux Slices
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const user = useSelector((state) => state.auth.user);

  // Synchronize HTML Theme Class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Counts
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistCount = wishlistItems.length;

  // Search Submit handler
  const searchHandler = (e) => {
    if (e) e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/products");
    }
  };

  // Web Speech API Voice Search
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening... Speak now 🎙️", { icon: "🎙️" });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast.error("Voice recognition failed. Try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setKeyword(speechToText);
      toast.success(`Search for: "${speechToText}"`);
      navigate(`/products?search=${encodeURIComponent(speechToText.trim())}`);
    };

    recognition.start();
  };

  // Logout Handler
  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Successfully logged out. Bye! 👋");
    navigate("/login");
  };

  return (
    <>
      <nav
        className="relative text-white sticky top-0 z-50 shadow-lg transition duration-300 overflow-hidden"
        style={{
          backgroundImage: headerBg ? `url(${headerBg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark glass overlay backdrop filter for readability */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md border-b border-white/10 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
          
          {/* Left section: Drawer Toggle + Brand Logo */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-white hover:text-cyan-400 transition cursor-pointer flex items-center justify-center rounded-xl bg-slate-900/40 border border-slate-800/40"
              title="Open Menu Drawer"
            >
              <FaBars size={18} />
            </button>
            
            <Link
              to="/"
              className="text-2xl font-black text-cyan-400 hover:text-cyan-300 transition duration-200"
            >
              ShopSphere 🚀
            </Link>
          </div>

          {/* Center Section: Search Input Form */}
          <form
            onSubmit={searchHandler}
            className="flex items-center bg-slate-950/60 dark:bg-slate-900/60 rounded-xl overflow-hidden w-full max-w-md shadow-inner border border-slate-800/80 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-4 py-2.5 text-white bg-transparent outline-none border-none text-xs placeholder-slate-450 font-semibold"
            />

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`p-3 text-slate-400 hover:text-cyan-400 transition ${
                isListening ? "animate-pulse text-red-500 hover:text-red-500" : ""
              }`}
              title="Search with your voice"
            >
              <FaMicrophone size={14} />
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-cyan-600 px-4 py-3 hover:bg-cyan-550 transition text-slate-950 flex items-center justify-center font-bold"
            >
              <FaSearch size={12} />
            </button>
          </form>

          {/* Right Section: ONLY Outfit AI Route Link */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <Link
              to="/outfit-generator"
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-455 hover:to-indigo-455 text-slate-950 font-black px-5 py-2.5 rounded-xl transition text-xs shadow shadow-cyan-500/10 cursor-pointer text-center"
            >
              Outfit AI
            </Link>
          </div>

        </div>
      </nav>

      {/* Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] transition-opacity duration-300"
        ></div>
      )}

      {/* Left Slider Drawer Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 text-white z-[1000] p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out shadow-2xl ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          
          {/* Drawer Top Header Area */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <Link
              to="/"
              onClick={() => setIsDrawerOpen(false)}
              className="text-2xl font-black text-cyan-450 tracking-wide"
            >
              ShopSphere 🚀
            </Link>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer transition"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Sidebar Menu Options */}
          <div className="flex flex-col gap-3 font-semibold text-xs text-slate-200">
            
            <Link
              to="/"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition"
            >
              <FaHome size={14} className="text-slate-400" /> Home
            </Link>

            <Link
              to="/products"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition"
            >
              <FaBox size={14} className="text-slate-400" /> Products
            </Link>

            <Link
              to="/cart"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition"
            >
              <div className="flex items-center gap-3">
                <FaShoppingCart size={14} className="text-slate-400" /> Cart
              </div>
              {cartCount > 0 && (
                <span className="bg-cyan-500 text-slate-950 rounded-full text-[9px] font-black px-2 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition"
            >
              <FaListAlt size={14} className="text-slate-400" /> My Orders
            </Link>

            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-900 text-yellow-400 transition font-bold"
              >
                🛡️ Admin Panel
              </Link>
            )}

            {user?.role === "Seller" && (
              <Link
                to="/seller/dashboard"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-900 text-emerald-400 transition font-bold"
              >
                💼 Seller Dashboard
              </Link>
            )}

            {/* Dark Mode Slider inside Menu */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-900 transition">
              <span className="flex items-center gap-3">
                {theme === "light" ? <FaMoon size={14} className="text-slate-400" /> : <FaSun size={14} className="text-slate-400" />} 
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-10 h-6 bg-slate-800 rounded-full p-1 cursor-pointer flex items-center transition"
              >
                <div className={`w-4 h-4 rounded-full bg-cyan-400 shadow-md transform transition-transform duration-200 ${theme === "dark" ? "translate-x-4" : ""}`}></div>
              </button>
            </div>

          </div>
        </div>

        {/* Drawer Account details Area (Login / Logout) */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          {!user ? (
            <Link
              to="/login"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full bg-cyan-600 hover:bg-cyan-550 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow text-xs uppercase tracking-wider"
            >
              <FaUser size={12} /> Login
            </Link>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center text-cyan-400 font-extrabold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Logged In</p>
                  <Link
                    to="/profile"
                    onClick={() => setIsDrawerOpen(false)}
                    className="font-bold text-sm text-cyan-400 hover:underline truncate block"
                  >
                    {user.name}
                  </Link>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  logoutHandler();
                }}
                className="w-full bg-red-600/10 hover:bg-red-650/20 border border-red-650/25 text-red-500 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <FaSignOutAlt size={12} /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default Navbar;