import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";
import dashboardBG from "../../assets/dashboardBG.jpg";
import ReusableButton from "../../components/ReusableButton";

const StoreOwnerDashboard = () => {
  const { user, logoutUser } = useAuth();
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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: `url(${dashboardBG})`,
      }}
    >
      <div className="backdrop-blur-md bg-black/40 w-full max-w-7xl p-6 md:p-10 mt-8 rounded-2xl shadow-lg border border-white/20 mx-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-300">Manage your Store Ratings</p>
          </div>
          <div className="flex gap-2">
            <ReusableButton
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
            >
              Logout
            </ReusableButton>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-white/10 backdrop-blur-sm shadow-md rounded-lg p-6 text-center mb-8 border border-white/20">
          <p className="text-lg font-semibold text-white mb-2">
            Average Store Rating
          </p>
          <p className="text-4xl text-yellow-400 font-bold">{averageRating}</p>
        </div>

        {/* Password Update Section */}
        <div
          id="update-password"
          className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Update Password
          </h2>
          <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              required
              className="px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
              autoComplete="current-password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
              autoComplete="new-password"
            />

            <div className="flex justify-center">
              <ReusableButton type="submit">Update Password</ReusableButton>
            </div>
          </form>

          {message && (
            <p className="text-sm text-center mt-2 text-green-400">{message}</p>
          )}
          {error && (
            <p className="text-sm text-center mt-2 text-red-400">{error}</p>
          )}
        </div>

        {/* Ratings List Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Users who submitted ratings
          </h2>
          {ratings.length === 0 ? (
            <p className="text-white/70">No ratings submitted yet.</p>
          ) : (
            <table className="w-full text-left text-white/90">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-2">User Name</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id} className="border-b border-white/10">
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
    </div>
  );
};

export default StoreOwnerDashboard;
