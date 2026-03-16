const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

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

// Database Connection using MONGODB_URI to match Vercel Settings
const connectDB = async () => {
  try {
    console.log("Connecting to Database...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from Environment Variables!");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ SUCCESS: MongoDB Connected to Atlas");
  } catch (error) {
    console.error("❌ DATABASE CONNECTION ERROR:", error.message);
  }
};
connectDB();

// Use routes from the src folder
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
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
