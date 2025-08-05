import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import BannerBG from "../../assets/BannerBG.jpg"; // Login Banner

const AddStore = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [owner_id, setOwnerId] = useState();
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get("/api/admin/store-owners");
      setOwners(response.data);
    } catch (err) {
      console.error("Failed to load store owners");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/admin/add-stores", {
        name,
        email,
        address,
        owner_id,
      });

      console.log("Store Added Successfully");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to add store");
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
          Add New Store
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/40 py-2 rounded-md">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Store Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter store name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Store Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter store email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Store Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
            placeholder="Enter store address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-white">
            Select Store Owner
          </label>
          <select
            value={owner_id || ""}
            onChange={(e) => setOwnerId(parseInt(e.target.value))}
            required
            className="w-full px-4 py-2 border border-white/30 bg-black/40 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none"
          >
            <option value="">Select Owner</option>
            {owners.map((owner) => (
              <option
                key={owner.id}
                value={owner.id}
                className="bg-black text-white"
              >
                {owner.id} - {owner.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-white/20 text-white py-2 rounded-md hover:bg-white/30 transition font-semibold text-lg backdrop-blur-sm"
        >
          Add Store
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

export default AddStore;
