import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

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

  // =============================
  // Fill Demo Credentials
  // =============================

  const fillAdmin = () => {
    setUser({
      email: "admin@gmail.com",
      password: "admin123",
    });
  };

  const fillUser = () => {
    setUser({
      email: "user@gmail.com",
      password: "user123",
    });
  };

  // =============================
  // Login
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post(
        "/auth/login",
        user
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("✅ Login Successful");

      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md shadow-xl rounded-xl p-8">

        <h1 className="text-4xl font-bold text-center mb-8">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold transition"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>
                    <div className="space-y-3">

            <button
              type="button"
              onClick={fillAdmin}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-bold transition"
            >
              🛡️ Fill Admin Credentials
            </button>

            <button
              type="button"
              onClick={fillUser}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-bold transition"
            >
              👤 Fill Demo User Credentials
            </button>

          </div>

        </form>

        
        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-600 font-bold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;