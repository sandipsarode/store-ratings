import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import signUpBannerBG from "../../assets/signUpBanner.jpg";
import ReusableButton from "../../components/ReusableButton";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        address,
      });

      console.log("Signup Success:", response.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data?.message || "Signup Failed");
      setError(err.response?.data?.message || "Something went wrong");
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

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-black/40 p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 border border-white/20 mx-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Create Account
        </h2>
        <p className="text-sm text-center text-gray-300">
          Join and Start Rating Your Favorite Stores
        </p>

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
            placeholder="Enter your name"
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
            autoComplete="new-password"
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
            placeholder="Enter your address"
          />
        </div>

        <div className="flex justify-center">
          <ReusableButton type="submit">Sign Up</ReusableButton>
        </div>

        <p className="text-sm text-center text-white">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-white underline cursor-pointer hover:text-gray-300"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
