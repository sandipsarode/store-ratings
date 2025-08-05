import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/api";
import { FaStar } from "react-icons/fa";
import dashboardBG from "../../assets/dashboardBG.jpg";
import ReusableButton from "../../components/ReusableButton";

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
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: `url(${dashboardBG})`,
      }}
    >
      <div className="backdrop-blur-md bg-black/40 w-full max-w-7xl p-6 md:p-10 mt-8 rounded-2xl shadow-lg border border-white/20 mx-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-300">Find and Rate your Favorite Stores</p>
          </div>
          <div className="flex gap-2">
            <ReusableButton onClick={() => navigate("/update-password")}>
              Update Password
            </ReusableButton>

            <ReusableButton
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
            >
              Logout
            </ReusableButton>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 px-4 py-2 border border-white/30 bg-white/10 text-white rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedStores.map((store) => (
            <div
              key={store.id}
              className="backdrop-blur-md bg-black/40 shadow-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white">{store.name}</h2>
              <p className="text-gray-300 mb-2">{store.address}</p>

              <div className="mb-4">
                <p className="font-medium text-white mb-1">Overall Ratings:</p>
                <p className="text-yellow-400 font-bold text-lg">
                  {store.averageRating || "No ratings yet"}
                </p>
                {store.totalRatings > 0 && (
                  <p className="text-sm text-gray-400">
                    {store.totalRatings} Ratings Submitted
                  </p>
                )}
              </div>

              <div>
                <p className="font-medium text-white mb-1">Your Rating:</p>
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
                            isActive ? "text-yellow-400" : "text-gray-500"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {store.myRating && editingStoreId !== store.id && (
                  <p className="mt-1 text-sm text-gray-400">
                    You rated this store {store.myRating} / 5
                  </p>
                )}

                <div className="mt-4">
                  <div className="flex justify-left">
                    <ReusableButton
                      onClick={() =>
                        setEditingStoreId(
                          editingStoreId === store.id ? null : store.id
                        )
                      }
                    >
                      {editingStoreId === store.id
                        ? "Cancel Edit"
                        : store.myRating
                        ? "Edit Rating"
                        : "Add Rating"}
                    </ReusableButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreList;
