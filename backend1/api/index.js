const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://fin-tracker-djkz.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Database Connection using the Vercel Variable: MONGO_URI
const connectDB = async () => {
  try {
    // We use MONGO_URI because that is what you saved in Vercel settings
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
connectDB();

// Routes - Pointing to your src/routes folder
app.use("/api/auth", require("../src/routes/auth"));
app.use("/api/transactions", require("../src/routes/transactions"));
app.use("/api/budgets", require("../src/routes/budgets"));
app.use("/api/categories", require("../src/routes/categories"));
app.use("/api/recurring", require("../src/routes/recurring"));
app.use("/api/goals", require("../src/routes/goals"));
app.use("/api/reports", require("../src/routes/reports"));
app.use("/api/insights", require("../src/routes/insights"));
app.use("/api/activities", require("../src/routes/activities"));
app.use("/api/settings", require("../src/routes/settings"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", database: "Connected" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
