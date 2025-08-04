const express = require("express");

const {
  getStoreOwnersController,
  addUserController,
  addStoreController,
  getUsersController,
  getStoresController,
  getDashboardData,
} = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Fetch dashboard data
router.get("/dashboard", verifyToken, getDashboardData);

// Fetch store owners
router.get("/store-owners", verifyToken, getStoreOwnersController);

// Add new user
router.post("/add-users", verifyToken, addUserController);

// Add store
router.post("/add-stores", verifyToken, addStoreController);

// Fetch all users
router.get("/users", verifyToken, getUsersController);

// Fetch all stores
router.get("/stores", verifyToken, getStoresController);

module.exports = router;
