const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    /\.vercel\.app$/, // Allows all Vercel deployments to talk to the backend
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/budgets", require("./routes/budgets"));

app.get("/", (req, res) => {
  res.json({ message: "FinTrackr API running successfully!" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for Vercel Serverless Functions
module.exports = app;
