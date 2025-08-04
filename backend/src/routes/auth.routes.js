const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller");

const router = express.Router();

// Registration - User
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Logout
router.get("/logout", logoutController);

module.exports = router;
