import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaShieldAlt, FaUser, FaSignInAlt } from "react-icons/fa";
import API from "../api/axios";
import { loginSuccess } from "../redux/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const fillAdmin = () => {
    setUser({
      email: "admin@gmail.com",
      password: "admin123",
    });
    toast.success("🛡️ Admin credentials filled");
  };

  const fillUser = () => {
    setUser({
      email: "user@gmail.com",
      password: "user123",
    });
    toast.success("👤 Demo User credentials filled");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", user);

      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      toast.success("Welcome back, Login Successful! 👋");
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden">
      
      {/* Dynamic CSS Keyframes Style Block */}
      <style>{`
        @keyframes float-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-blob-reverse {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, 30px) scale(0.9); }
          66% { transform: translate(30px, -20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes scale-up-card {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-blob-1 {
          animation: float-blob 12s infinite ease-in-out;
        }
        .animate-blob-2 {
          animation: float-blob-reverse 15s infinite ease-in-out;
        }
        .animate-card-in {
          animation: scale-up-card 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Premium e-commerce background image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/login_shopping_bg.jpg"
          alt="Premium Boutique Shopping Backdrop"
          className="w-full h-full object-cover opacity-[0.45]"
        />
        <div className="absolute inset-0 bg-slate-950/55"></div>
      </div>

      {/* Dynamic Glowing background shapes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none animate-blob-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none animate-blob-2"></div>

      {/* Main glassmorphism card */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 w-full max-w-md shadow-2xl rounded-3xl p-8 relative z-10 animate-card-in">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <FaSignInAlt size={24} className="text-slate-950" />
          </div>
          <h1 className="text-3xl font-black text-white bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-semibold">
            Login to access your personal ShopSphere panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm font-semibold">
          
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <FaEnvelope size={14} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-800 bg-slate-950/60 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <FaLock size={14} />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full border border-slate-800 bg-slate-950/60 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-455 hover:to-indigo-455 text-slate-950 font-black py-4 rounded-xl transition shadow shadow-cyan-500/10 cursor-pointer text-center text-sm transform hover:scale-[1.01]"
          >
            {loading ? "Verifying Credentials..." : "Access Account"}
          </button>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-black">
              ⚡ Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillAdmin}
                className="bg-yellow-500/5 hover:bg-yellow-500/15 border border-yellow-500/20 text-yellow-500 py-3 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaShieldAlt size={11} /> Admin Panel
              </button>
              <button
                type="button"
                onClick={fillUser}
                className="bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 py-3 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaUser size={11} /> Buyer Account
              </button>
            </div>
          </div>

        </form>

        <p className="text-center mt-8 text-xs text-slate-350 font-semibold">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition ml-1"
          >
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;