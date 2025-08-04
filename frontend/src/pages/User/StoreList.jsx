import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";
import { FaStar } from "react-icons/fa";

const StoreList = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStoreId, setEditingStoreId] = useState(null);

  useEffect(() => {
    fetchStoresAndRatings();
  }, [ratings]);

  const fetchStoresAndRatings = async () => {
    try {
      const storesRes = await axios.get("/api/stores");
      setStores(storesRes.data.stores);

      const ratingsRes = await axios.get("/api/stores/ratings");
      setRatings(ratingsRes.data.ratings);
    } catch (err) {
      console.error("Failed to fetch stores or ratings", err);
    }
  };

  const handleRatingSubmit = async (store_id, ratingValue) => {
    try {
      const existingRating = ratings.find(
        (r) => r.store_id === store_id && r.user_id === user.id
      );

      if (existingRating) {
        // User already rated — Update Rating
        const response = await axios.patch("/api/user/ratings", {
          store_id,
          rating: ratingValue,
        });

        const updatedRating = response.data.rating;

        const updatedRatings = ratings.map((r) =>
          r.id === existingRating.id
            ? { ...r, rating: updatedRating.rating }
            : r
        );
        setRatings(updatedRatings);
      } else {
        // New Rating — Add Rating
        const response = await axios.post("/api/user/ratings", {
          store_id,
          rating: ratingValue,
        });

        const newRating = response.data.rating;

        setRatings((prev) => [
          ...prev,
          {
            id: newRating.id,
            store_id: newRating.store_id,
            user_id: newRating.user_id,
            user_name: user.name,
            rating: newRating.rating,
          },
        ]);
      }

      setEditingStoreId(null);
    } catch (err) {
      console.error("Failed to submit/update rating", err);
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  const enrichedStores = filteredStores.map((store) => {
    const storeRatings = ratings.filter((r) => r.store_id === store.id);

    const averageRating =
      storeRatings.length > 0
        ? (
            storeRatings.reduce((sum, r) => sum + r.rating, 0) /
            storeRatings.length
          ).toFixed(1)
        : null;

    const myRating =
      storeRatings.find((r) => r.user_id === user.id)?.rating || null;

    return {
      ...store,
      ratings: storeRatings,
      averageRating,
      totalRatings: storeRatings.length,
      myRating,
    };
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store List</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/update-password")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Update Password
          </button>
          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search stores by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded-md w-full md:w-1/3"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrichedStores.map((store) => (
          <div key={store.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <p className="text-gray-500 mb-2">{store.address}</p>

            <div className="mb-4">
              <p className="font-medium mb-1">Overall Ratings:</p>
              <p className="text-yellow-500 font-bold text-lg">
                {store.averageRating || "No ratings yet"}
              </p>
              {store.totalRatings > 0 && (
                <p className="text-sm text-gray-600">
                  {store.totalRatings} Ratings Submitted
                </p>
              )}
              <ul className="mt-2 text-sm text-gray-600">
                {store.ratings.map((rating, idx) => (
                  <li key={idx}>
                    {rating.user_name}: {rating.rating} / 5
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1">Your Rating:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isActive = num <= (store.myRating || 0);
                  const isEditable = editingStoreId === store.id;

                  return (
                    <button
                      key={num}
                      onClick={() =>
                        isEditable ? handleRatingSubmit(store.id, num) : null
                      }
                      disabled={!isEditable}
                      className={`focus:outline-none ${
                        !isEditable ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <FaStar
                        size={24}
                        className={`transition ${
                          isActive ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {store.myRating && editingStoreId !== store.id && (
                <p className="mt-1 text-sm text-gray-600">
                  You rated this store {store.myRating} / 5
                </p>
              )}

              <button
                onClick={() =>
                  setEditingStoreId(
                    editingStoreId === store.id ? null : store.id
                  )
                }
                className="mt-2 text-indigo-600 text-sm underline"
              >
                {editingStoreId === store.id
                  ? "Cancel Edit"
                  : store.myRating
                  ? "Edit Rating"
                  : "Add Rating"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
