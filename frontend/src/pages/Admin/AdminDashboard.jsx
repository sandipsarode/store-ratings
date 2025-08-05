import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import dashboardBG from "../../assets/dashboardBG.jpg";
import ReusableButton from "../../components/ReusableButton";

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
  const { user, logoutUser } = useAuth();
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

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchStore.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${dashboardBG})` }}
    >
      <div className="backdrop-blur-md bg-black/40 w-full max-w-7xl p-6 md:p-10 mt-8 rounded-2xl shadow-lg border border-white/20 mx-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-300">Admin Control Panel</p>
          </div>
          <div className="flex gap-2">
            <ReusableButton onClick={handleLogout}>Logout</ReusableButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm shadow-md rounded-lg p-6 text-center border border-white/20">
            <p className="text-lg font-semibold text-white">Total Users</p>
            <p className="text-3xl text-yellow-400 font-bold">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm shadow-md rounded-lg p-6 text-center border border-white/20">
            <p className="text-lg font-semibold text-white">Total Stores</p>
            <p className="text-3xl text-yellow-400 font-bold">
              {stats.totalStores}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm shadow-md rounded-lg p-6 text-center border border-white/20">
            <p className="text-lg font-semibold text-white">Total Ratings</p>
            <p className="text-3xl text-yellow-400 font-bold">
              {stats.totalRatings}
            </p>
          </div>
        </div>

        {/* Add Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <ReusableButton onClick={() => navigate("/add-user")}>
            Add User
          </ReusableButton>
          <ReusableButton onClick={() => navigate("/add-store")}>
            Add Store
          </ReusableButton>
        </div>

        {/* Users List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Users</h2>
          <input
            type="text"
            placeholder="Search Users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="mb-4 px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
          />
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md border border-white/20 overflow-x-auto">
            <table className="w-full text-left text-white/90">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
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

        {/* Stores List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Stores</h2>
          <input
            type="text"
            placeholder="Search Stores..."
            value={searchStore}
            onChange={(e) => setSearchStore(e.target.value)}
            className="mb-4 px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
          />
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md border border-white/20 overflow-x-auto">
            <table className="w-full text-left text-white/90">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Owner Email</th>
                  <th className="px-4 py-2">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id} className="border-b border-white/10">
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
    </div>
  );
};

export default AdminDashboard;
