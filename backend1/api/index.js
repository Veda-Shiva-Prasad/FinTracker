const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5500",
    "https://your-app-name.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

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
const categoryRoutes = require("../src/routes/categories");
const recurringRoutes = require("../src/routes/recurring");
const goalRoutes = require("../src/routes/goals");
const reportRoutes = require("../src/routes/reports");
const insightRoutes = require("../src/routes/insights");
const activityRoutes = require("../src/routes/activities");
const settingRoutes = require("../src/routes/settings");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/settings", settingRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

module.exports = app;

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Routes registered:");
    console.log("- /api/auth");
    console.log("- /api/transactions");
    console.log("- /api/budgets");
    console.log("- /api/categories");
    console.log("- /api/recurring");
    console.log("- /api/goals");
    console.log("- /api/reports");
    console.log("- /api/insights");
    console.log("- /api/activities");
    console.log("- /api/settings");
  });
}
