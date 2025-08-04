import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Update Password
        </h2>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter old password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter new password"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Update Password
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-indigo-500 text-sm text-center mt-2"
        >
          Go Back
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
