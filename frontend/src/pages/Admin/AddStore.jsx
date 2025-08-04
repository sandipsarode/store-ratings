import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Add New Store
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Store Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter store name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Store Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter store email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Store Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
            placeholder="Enter store address"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Select Owner ID</label>
          <select
            value={owner_id}
            onChange={(e) => setOwnerId(parseInt(e.target.value))}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-indigo-500"
          >
            <option value="">Select Owner ID</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.id} - {owner.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
