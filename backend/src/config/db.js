const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/fintrackr"
      // Removed deprecated options for cleaner connection
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("Please make sure MongoDB is running on your system");
    process.exit(1);
  }
};

module.exports = connectDB;
