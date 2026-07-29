import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load users list");
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

  const changeRole = async (id, role) => {
    try {
      await API.put(`/users/${id}/role`, { role });
      toast.success(`Role updated to ${role} successfully`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update role");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-350">Loading Users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen text-slate-800 dark:text-slate-200 transition duration-300">
      
      <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white">
            Role Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Promote or re-assign platform permissions
          </p>
        </div>

        <div className="bg-cyan-600 text-white px-5 py-3 rounded-xl font-bold shadow-md">
          Total Accounts : {filteredUsers.length}
        </div>
      </div>

      <input
        type="text"
        placeholder="Search users by name or email address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3.5 mb-6 text-sm focus:outline-none focus:border-cyan-500 transition"
      />

      <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 dark:bg-slate-950 text-white uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-4 text-left pl-6">Name</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-center">Assigned Role</th>
              <th className="p-4 text-center pr-6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition"
              >
                <td className="p-4 pl-6 font-bold text-slate-850 dark:text-white">
                  {user.name}
                </td>

                <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                  {user.email}
                </td>

                <td className="p-4 text-center">
                  <select
                    value={user.role || (user.isAdmin ? "Admin" : "User")}
                    onChange={(e) => changeRole(user._id, e.target.value)}
                    className="border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-lg px-3 py-1.5 font-semibold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Seller">Seller</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                  </select>
                </td>

                <td className="p-4 text-center pr-6">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border border-red-500/20 hover:border-transparent cursor-pointer"
                  >
                    Delete Account
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-12 text-slate-450 dark:text-slate-500 text-base"
                >
                  No User Accounts Found 
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