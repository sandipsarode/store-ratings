import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Success:", response.data);

      // Store user in localStorage & Context
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      loginUser(response.data.user); // <-- Update global context immediately

      const userRole = response.data.user.role;

      // Navigate based on role
      if (userRole === "admin") navigate("/admin-dashboard");
      else if (userRole === "owner") navigate("/storeowner-dashboard");
      else navigate("/user-dashboard");
    } catch (err) {
      console.error(err.response?.data?.message || "Login Failed");
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter your email"
            autoComplete="email"
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
          >
            <option value="user">User</option>
            <option value="storeowner">Store Owner</option>
            <option value="admin">System Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>

        {/* Signup Link — Only Visible if Role is User */}
        {role === "user" && (
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-500 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
