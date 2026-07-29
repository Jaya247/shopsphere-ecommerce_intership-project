import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="text-center text-3xl font-bold dark:text-white transition py-20">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-slate-950 py-12 transition duration-300">

      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl p-10 transition duration-300">

        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 dark:text-white">
          👤 My Profile
        </h1>

        <div className="space-y-6">

          <div>
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold uppercase tracking-wider">
              Full Name
            </p>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {user.name}
            </h2>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          <div>
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold uppercase tracking-wider">
              Email Address
            </p>
            <h2 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
              {user.email}
            </h2>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          <div>
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold uppercase tracking-wider mb-2.5">
              Role
            </p>
            <span
              className={`px-4 py-2 rounded-xl text-white font-bold tracking-wide text-xs ${
                user.isAdmin
                  ? "bg-green-600 dark:bg-green-700 shadow"
                  : "bg-blue-600 dark:bg-blue-700 shadow"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          <div>
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold uppercase tracking-wider">
              User Account ID
            </p>
            <p className="break-all text-slate-700 dark:text-slate-400 font-mono mt-1">
              {user._id}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;