import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";
import signUpBannerBG from "../../assets/signUpBanner.jpg";
import ReusableButton from "../../components/ReusableButton";

const UpdatePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
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
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${signUpBannerBG})`,
      }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Update Password Form */}
      <form
        onSubmit={handleUpdate}
        className="relative z-10 backdrop-blur-md bg-black/40 p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-white/20 mx-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Update Password
        </h2>
        <p className="text-sm text-center text-gray-300">
          Hello {user.name.split(" ")[0]}, manage your security!
        </p>

        {message && (
          <p className="text-green-400 text-sm text-center bg-green-900/40 py-2 rounded-md">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/40 py-2 rounded-md">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter old password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-center">
          <ReusableButton type="submit">Update Password</ReusableButton>
        </div>

        <p
          onClick={() => navigate(-1)}
          className="text-white text-sm text-center underline cursor-pointer hover:text-gray-300"
        >
          Go Back
        </p>
      </form>
    </div>
  );
};

export default UpdatePassword;
