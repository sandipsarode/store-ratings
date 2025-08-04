import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";

const StoreOwnerDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const [averageRating, setAverageRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRatingsData();
  }, []);

  const fetchRatingsData = async () => {
    try {
      const res = await axios.get(`/api/stores/ratings/my`);
      console.log("Ratings Data:", res.data);

      setAverageRating(res.data.averageRating);
      setRatings(res.data.ratings);
    } catch (err) {
      console.error("Failed to load ratings data");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.patch(`/api/user/update-password`, {
        oldPassword,
        newPassword,
      });

      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update password");
      setError(err.response?.data?.message || "Incorrect Old Password");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Average Rating Card */}
      <div className="bg-white shadow-md rounded-lg p-6 text-center mb-8">
        <p className="text-lg font-semibold">Average Store Rating</p>
        <p className="text-4xl text-indigo-600 font-bold">{averageRating}</p>
      </div>

      {/* Password Update Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Password</h2>
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            required
            className="px-4 py-2 border rounded-md focus:outline-indigo-500"
            autoComplete="current-password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="px-4 py-2 border rounded-md focus:outline-indigo-500"
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-2 text-green-600">{message}</p>
        )}
        {error && (
          <p className="text-sm text-center mt-2 text-red-600">{error}</p>
        )}
      </div>

      {/* Ratings List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Users who submitted ratings
        </h2>
        {ratings.length === 0 ? (
          <p>No ratings submitted yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id} className="border-b">
                  <td className="px-4 py-2">{rating.user_name}</td>
                  <td className="px-4 py-2">{rating.rating}</td>
                  <td className="px-4 py-2">{rating.user_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
