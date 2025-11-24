const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    "https://your-app-name.vercel.app",
    "http://localhost:3000",
    "http://localhost:5500",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected to Atlas");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Import routes
const authRoutes = require("../src/routes/auth");
const transactionRoutes = require("../src/routes/transactions");
const budgetRoutes = require("../src/routes/budgets");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Export for Vercel serverless function
module.exports = app;
