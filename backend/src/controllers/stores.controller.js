const bcrypt = require("bcryptjs");
const validator = require("validator");

const pool = require("../db/db");

// Fetch all stores
async function getStoresController(req, res) {
  try {
    const query = `
            SELECT 
                s.id,
                s.name,
                s.email,
                s.address,
                ROUND(AVG(r.rating)::numeric, 2) AS average_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id, s.name, s.email, s.address
            ORDER BY s.id;
        `;

    const result = await pool.query(query);

    const stores = result.rows.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      rating: store.average_rating || 0,
    }));

    res.status(200).json({ stores });
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Fetch all users
async function getUsersController(req, res) {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    // Get all users
    const usersResult = await pool.query(
      `SELECT id, name, email, address, role FROM users`
    );

    const users = usersResult.rows;

    // For each user, if they're owner, fetch average store rating
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.role === "owner") {
          const ratingResult = await pool.query(
            `
                    SELECT ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
                    FROM ratings r
                    JOIN stores s ON s.id = r.store_id
                    WHERE s.owner_id = $1
                `,
            [user.id]
          );

          return {
            ...user,
            average_rating: ratingResult.rows[0].avg_rating || 0,
          };
        }

        // For normal user or admin, no rating needed
        return user;
      })
    );

    res.status(200).json({ users: enhancedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Fetch all ratings
async function getRatingsController(req, res) {
  try {
    const userId = req.user.id;

    const query = `
            SELECT 
                r.id,
                r.rating,
                r.store_id,
                r.user_id,
                u.name AS user_name,
                s.name AS store_name
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            ORDER BY r.id DESC;
        `;

    const result = await pool.query(query);

    const ratings = result.rows.map((rating) => ({
      id: rating.id,
      rating: rating.rating,
      user_id: rating.user_id,
      user_name: rating.user_name,
      store_id: rating.store_id,
      store_name: rating.store_name,
    }));

    res.status(200).json({ ratings });
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get My Store Ratings Only
async function getMyStoreRatingsController(req, res) {
  const { role, id: user_id } = req.user;

  try {
    if (role !== "owner") {
      return res.status(403).json({ message: "Access denied." });
    }

    const storeResult = await pool.query(
      "SELECT * FROM stores WHERE owner_id = $1",
      [user_id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "You don't own any stores." });
    }

    const store = storeResult.rows[0];

    const ratingsResult = await pool.query(
      `SELECT r.id, r.rating,
              u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1`,
      [store.id]
    );

    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 2) AS average_rating
       FROM ratings
       WHERE store_id = $1`,
      [store.id]
    );

    const averageRating = avgResult.rows[0].average_rating || 0;

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
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
  getUsersController,
  getStoresController,
  getRatingsController,
  getMyStoreRatingsController,
};
