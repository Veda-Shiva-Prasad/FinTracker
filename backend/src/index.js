const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Debug: Check if environment variables are loaded
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No");
console.log("MONGODB_URI loaded:", process.env.MONGODB_URI ? "Yes" : "No");

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to Database
connectDB();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
