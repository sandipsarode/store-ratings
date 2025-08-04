const pool = require("../db/db");

// Add Ratings
async function addRatingsController(req, res) {
  const { id: user_id, role } = req.user;
  const { store_id, rating } = req.body;

  // console.log("Rating Submission: ", { user_id, store_id, rating });

  if (role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Only users can add ratings." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const storeCheck = await pool.query("SELECT id FROM stores WHERE id = $1", [
      store_id,
    ]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Store not found." });
    }

    const query = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, store_id)
      DO UPDATE SET rating = EXCLUDED.rating
      RETURNING *;
    `;

    const result = await pool.query(query, [user_id, store_id, rating]);

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update Ratings
async function updateRatingsController(req, res) {
  const { id: user_id, role } = req.user;
  const { store_id, rating } = req.body;

  if (role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Only users can update ratings." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    // Check if the rating exists for this user and store
    const check = await pool.query(
      "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
      [user_id, store_id]
    );

    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Rating not found. You must rate the store first." });
    }

    const query = `UPDATE ratings
            SET rating = $1
            WHERE user_id = $2 AND store_id = $3
            RETURNING *`;

    const updated = await pool.query(query, [rating, user_id, store_id]);

    res.status(200).json({
      message: "Rating updated successfully",
      rating: updated.rows[0],
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete Ratings
async function deleteRatingsController(req, res) {
  const { id: user_id, role } = req.user;
  const { id: rating_id } = req.params;

  if (role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Only users can delete ratings." });
  }

  try {
    // Check if rating belongs to this user
    const ratingCheck = await pool.query(
      "SELECT id FROM ratings WHERE id = $1 AND user_id = $2",
      [rating_id, user_id]
    );

    if (ratingCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Rating not found or not authorized to delete." });
    }

    await pool.query("DELETE FROM ratings WHERE id = $1", [rating_id]);

    res.status(200).json({ message: "Rating deleted successfully." });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get My-Rating
async function getMyRatingsController(req, res) {
  const { id: user_id, role } = req.user;

  if (role !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Only users can view their ratings." });
  }

  try {
    const query = `SELECT r.id, r.rating, s.name AS store_name
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE r.user_id = $1`;

    const result = await pool.query(query, [user_id]);

    res.status(200).json({
      message: "My ratings",
      ratings: result.rows,
    });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Stores All Ratings
async function getStoresRatingsController(req, res) {
  const { role, id: user_id } = req.user;
  const { store_id } = req.params;

  try {
    // Check if store exists
    const storeResult = await pool.query("SELECT * FROM stores WHERE id = $1", [
      store_id,
    ]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found." });
    }

    const store = storeResult.rows[0];

    // If role is owner, ensure the owner owns the store
    if (role === "owner" && store.owner_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Access denied. You don't own this store." });
    }

    // Fetch all ratings for the store
    const ratingsResult = await pool.query(
      `SELECT r.id, r.rating,
                    u.id AS user_id, u.name AS user_name, u.email AS user_email
            FROM ratings r
            JOIN users u ON u.id = r.user_id
            WHERE r.store_id = $1`,
      [store_id]
    );

    // Calculate average rating
    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 2) AS average_rating
             FROM ratings
             WHERE store_id = $1`,
      [store_id]
    );

    const averageRating = avgResult.rows[0].average_rating || 0;

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner_id: store.owner_id,
      },
      averageRating,
      totalRatings: ratingsResult.rows.length,
      ratings: ratingsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching store ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addRatingsController,
  updateRatingsController,
  deleteRatingsController,
  getMyRatingsController,
  getStoresRatingsController,
};
