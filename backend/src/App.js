const cors = require("cors");

const express = require("express");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const storesRoutes = require("./routes/stores.routes");
const ratingRoutes = require("./routes/ratings.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // 👈 allows cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api", ratingRoutes);

module.exports = app;
