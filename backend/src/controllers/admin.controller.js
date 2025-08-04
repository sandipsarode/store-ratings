const bcrypt = require("bcryptjs");
const validator = require("validator");

const pool = require("../db/db");

// Fetch dashboard data
async function getDashboardData(req, res) {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  try {
    const usersResult = await pool.query(
      "SELECT id, name, email, address, role FROM users ORDER BY id"
    );
    const storesResult = await pool.query(
      "SELECT id, name, email, address FROM stores ORDER BY id"
    );
    const ratingsResult = await pool.query("SELECT COUNT(*) FROM ratings");

    const stats = {
      totalUsers: usersResult.rowCount,
      totalStores: storesResult.rowCount,
      totalRatings: parseInt(ratingsResult.rows[0].count) || 0,
    };

    res.status(200).json({
      stats,
      users: usersResult.rows,
      stores: storesResult.rows,
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
}

// Add User controller
async function addUserController(req, res) {
  const { name, email, password, address, role } = req.body;
  const { role: currentUserRole } = req.user;

  // Check Where the api is accessed by admin only
  if (currentUserRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  if (!["admin", "owner", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  // Validations
  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters long and include at least one uppercase letter and one special character",
    });
  }

  if (!address || address.length > 400) {
    return res.status(400).json({
      message: "Address must be less than 400 characters",
    });
  }

  // Check for existing email
  const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (emailCheck.rows.length > 0) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query = `
            INSERT INTO users (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
            `;

    const result = await pool.query(query, [
      name,
      email,
      hashedPassword,
      address,
      role,
    ]);

    res.status(201).json({
      message: "New user added successful!",
      userId: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error signing up",
      error: err.message,
    });
  }
}

// Add Store controller
async function addStoreController(req, res) {
  const { name, email, address, owner_id } = req.body;
  const { role } = req.user; // from auth middleware

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Validations
  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  if (!address || address.length > 400) {
    return res.status(400).json({
      message: "Address must be less than 400 characters",
    });
  }

  // Check for existing email
  const emailCheck = await pool.query(
    "SELECT id FROM stores WHERE email = $1",
    [email]
  );
  if (emailCheck.rows.length > 0) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  // Validate owner_id if provided
  // Validate owner_id if provided
  if (owner_id) {
    const ownerCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'owner'",
      [owner_id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid owner_id. No such user with role 'owner'.",
      });
    }
  }

  try {
    const query = `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`;

    const result = await pool.query(query, [
      name,
      email,
      address,
      owner_id || null,
    ]);

    res.status(201).json({
      message: "Store added successfully",
      store: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding store:", error);
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
      `SELECT id, name, email, address, role FROM users ORDER BY id`
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

// Fetch all stores
async function getStoresController(req, res) {
  const { role } = req.user;

  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can access this resource." });
  }

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

// Fetch store owners
async function getStoreOwnersController(req, res) {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  try {
    const result = await pool.query(
      `SELECT id, name FROM users WHERE role = 'owner' ORDER BY id`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching store owners:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addUserController,
  addStoreController,
  getUsersController,
  getStoresController,
  getDashboardData,
  getStoreOwnersController,
};
