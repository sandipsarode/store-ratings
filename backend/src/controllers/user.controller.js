const bcrypt = require("bcryptjs");

const pool = require("../db/db");

// Update Password
async function updatePasswordController(req, res) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validation for new passwords
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters long and include at least one uppercase letter and one special character",
    });
  }

  try {
    // Fetch current hashed password
    const userQuery = "SELECT password FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(
      oldPassword,
      userResult.rows[0].password
    );
    if (!validPassword) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(updateQuery, [hashedNewPassword, userId]);

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// Profile
async function profileController(req, res) {
  try {
    const userId = req.user.id;

    const query =
      "SELECT id, name, email, address, role FROM users WHERE id = $1";
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User profile fetched",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { updatePasswordController, profileController };
