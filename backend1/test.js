const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://fintracker:gvdt53NHlEVluo3e@cluster0.ipqcxfd.mongodb.net/fintracker?retryWrites=true&w=majority&appName=Cluster0",
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Get all users
    const db = mongoose.connection.db;
    const users = await db.collection("users").find().toArray();

    console.log("\n📋 Users in database:");
    if (users.length === 0) {
      console.log("No users found");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, Name: ${user.name}`);
      });
    }

    mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  })
  .catch((err) => console.log("❌ Error:", err));
