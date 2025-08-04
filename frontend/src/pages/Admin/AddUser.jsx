import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Add New User
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter user name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter user email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter user address"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
          >
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
