import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import BannerBG from "../../assets/BannerBG.jpg"; // Login Banner

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default Role
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/admin/add-users", {
        name,
        email,
        address,
        password,
        role,
      });

      console.log("User Added Successfully");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to add user");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${BannerBG})`,
      }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-black/40 p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-white/20 mx-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Add New User
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/40 py-2 rounded-md">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter user name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter user email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter user address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-black/40 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none"
          >
            <option value="user" className="bg-black text-white">
              User
            </option>
            <option value="owner" className="bg-black text-white">
              Store Owner
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-white/20 text-white py-2 rounded-md hover:bg-white/30 transition font-semibold text-lg backdrop-blur-sm"
        >
          Add User
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin-dashboard")}
          className="text-white underline text-sm text-center hover:text-gray-300"
        >
          Go Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default AddUser;
