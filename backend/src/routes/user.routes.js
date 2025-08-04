const express = require("express");
const jwt = require("jsonwebtoken");

const {
  updatePasswordController,
  profileController,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Update Password
router.patch("/update-password", verifyToken, updatePasswordController);

// Profile
router.get("/profile", verifyToken, profileController);

module.exports = router;
