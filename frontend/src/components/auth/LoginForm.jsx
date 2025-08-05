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
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/assets/BannerBG.jpg')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-black/40 p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-white/20 mx-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Welcome Back!
        </h2>
        <p className="text-sm text-center text-gray-300">
          Rate Your Favorite Stores
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/40 py-2 rounded-md">
            {error}
          </p>
        )}

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
            placeholder="Enter your email"
            autoComplete="email"
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-white/30 bg-black/40 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none"
          >
            <option value="user" className="bg-black text-white">
              User
            </option>
            <option value="storeowner" className="bg-black text-white">
              Store Owner
            </option>
            <option value="admin" className="bg-black text-white">
              System Admin
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-white/20 text-white py-2 rounded-md hover:bg-white/30 transition font-semibold text-lg backdrop-blur-sm"
        >
          Login
        </button>

        {role === "user" && (
          <p className="text-sm text-center text-white">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-white underline cursor-pointer hover:text-gray-300"
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
