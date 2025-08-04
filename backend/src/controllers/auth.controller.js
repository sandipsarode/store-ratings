const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const pool = require("../db/db");

// Register - User
async function registerController(req, res) {
  const { name, email, password, address } = req.body;

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
            VALUES ($1, $2, $3, $4, 'user')
            RETURNING id;
            `;

    const result = await pool.query(query, [
      name,
      email,
      hashedPassword,
      address,
    ]);

    res.status(201).json({
      message: "Signup successful",
      userId: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error signing up",
      error: err.message,
    });
  }
}

// Login
async function loginController(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        message: "Invalid password",
      });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax", // or 'None' with secure: true for cross-domain
    });

    res.status(200).json({
      message: "User Logged In successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
}

// Logout
async function logoutController(req, res) {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logged Out!",
  });
}

module.exports = { registerController, loginController, logoutController };
