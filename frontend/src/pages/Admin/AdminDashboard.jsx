import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";

// ===== Enrich Stores with Average Ratings Function =====
const enrichStoresWithRatings = (stores, ratings) => {
  return stores.map((store) => {
    const storeRatings = ratings.filter((r) => r.store_id === store.id);
    const averageRating =
      storeRatings.length > 0
        ? (
            storeRatings.reduce((sum, r) => sum + r.rating, 0) /
            storeRatings.length
          ).toFixed(1)
        : "No ratings";

    return {
      ...store,
      average_rating: averageRating,
    };
  });
};

const AdminDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [ratings, setRatings] = useState([]);

  // Fetch Dashboard Stats & Lists
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard");
      const ratingRes = await axios.get("/api/stores/ratings");

      const enrichedStores = enrichStoresWithRatings(
        res.data.stores,
        ratingRes.data.ratings
      );

      setRatings(ratingRes.data.ratings);
      setStats(res.data.stats);
      setUsers(res.data.users);
      setStores(enrichedStores);
    } catch (err) {
      console.error("Failed to load dashboard data");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchStore.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg font-semibold">Total Users</p>
          <p className="text-2xl text-indigo-600 font-bold">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg font-semibold">Total Stores</p>
          <p className="text-2xl text-indigo-600 font-bold">
            {stats.totalStores}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg font-semibold">Total Ratings</p>
          <p className="text-2xl text-indigo-600 font-bold">
            {stats.totalRatings}
          </p>
        </div>
      </div>

      {/* Add Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => navigate("/add-user")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add User
        </button>
        <button
          onClick={() => navigate("/add-store")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add Store
        </button>
      </div>

      {/* User Listing */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <input
          type="text"
          placeholder="Search Users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-md w-full md:w-1/3"
        />
        <div className="bg-white rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Listing */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Stores</h2>
        <input
          type="text"
          placeholder="Search Stores..."
          value={searchStore}
          onChange={(e) => setSearchStore(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-md w-full md:w-1/3"
        />
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Owner Email</th>
                <th className="px-4 py-2">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className="border-b">
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.address}</td>
                  <td className="px-4 py-2">{store.email}</td>
                  <td className="px-4 py-2">{store.average_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
