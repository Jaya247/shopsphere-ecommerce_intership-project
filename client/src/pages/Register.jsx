import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import API from "../api/axios";
import { loginSuccess } from "../redux/slices/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/register", user);

      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      toast.success("Account Created Successfully! Welcome 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration Failed");
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
            <FaUserPlus size={24} className="text-slate-950" />
          </div>
          <h1 className="text-3xl font-black text-white bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-semibold">
            Join ShopSphere and explore premium deals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm font-semibold">
          
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <FaUser size={14} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-800 bg-slate-950/60 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-medium"
            />
          </div>

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
            {loading ? "Creating Profile..." : "Register Now"}
          </button>

        </form>

        <p className="text-center mt-8 text-xs text-slate-350 font-semibold">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition ml-1"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;