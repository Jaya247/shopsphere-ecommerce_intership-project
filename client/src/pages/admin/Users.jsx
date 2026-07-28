import { useEffect, useState } from "react";
import API from "../../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/users");

      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (error) {
      console.log(error);
      alert("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(result);
  }, [search, users]);

  const changeRole = async (id) => {
    try {
      await API.put(`/users/${id}/role`);

      alert("✅ User Role Updated");

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Unable to update role");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);

      alert("✅ User Deleted Successfully");

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Unable to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-3xl mt-20">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Manage Users
        </h1>

        <div className="bg-cyan-600 text-white px-5 py-3 rounded-xl font-bold">
          Total Users : {filteredUsers.length}
        </div>

      </div>

      <input
        type="text"
        placeholder="Search by Name or Email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6"
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 text-center"
              >

                <td className="p-4 font-semibold">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold ${
                      user.isAdmin
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>

                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      changeRole(user._id)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    {user.isAdmin
                      ? "Remove Admin"
                      : "Make Admin"}
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(user._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-500"
                >
                  No Users Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Users;