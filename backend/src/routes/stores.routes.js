const express = require("express");

const {
  getUsersController,
  getStoresController,
  getRatingsController,
  getMyStoreRatingsController,
} = require("../controllers/stores.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Fetch all stores
router.get("/", verifyToken, getStoresController);

// Fetch all users
router.get("/users", verifyToken, getUsersController);

// Fetch all ratings
router.get("/ratings", verifyToken, getRatingsController);

// Get my store ratings only
router.get("/ratings/my", verifyToken, getMyStoreRatingsController);

module.exports = router;
