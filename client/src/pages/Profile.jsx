import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    setUser(loggedUser);
  }, [navigate]);

  if (!user) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-4xl font-bold mb-8">
          👤 My Profile
        </h1>

        <div className="space-y-6">

          <div>
            <p className="text-gray-500">
              Full Name
            </p>

            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <h2 className="text-2xl font-semibold">
              {user.email}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">
              Role
            </p>

            <span
              className={`px-4 py-2 rounded-full text-white font-semibold ${
                user.isAdmin
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </div>

          <div>
            <p className="text-gray-500">
              User ID
            </p>

            <p className="break-all text-gray-700">
              {user._id}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;