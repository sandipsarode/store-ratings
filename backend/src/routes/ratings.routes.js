const express = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  addRatingsController,
  updateRatingsController,
  deleteRatingsController,
  getMyRatingsController,
  getStoresRatingsController,
} = require("../controllers/ratings.controller");

const router = express.Router();

// Add Ratings
router.post("/user/ratings", verifyToken, addRatingsController);

// Update Ratings
router.patch("/user/ratings", verifyToken, updateRatingsController);

// Delete Ratings
router.delete("/user/ratings/:id", verifyToken, deleteRatingsController);

// Get My-Ratings
router.get("/user/ratings/my", verifyToken, getMyRatingsController);

// Get Single store Ratings
// router.get(
//   "/stores/ratings/:store_id",
//   verifyToken,
//   getStoresRatingsController
// );

module.exports = router;
