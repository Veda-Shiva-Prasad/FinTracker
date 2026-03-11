const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// GET activities
router.get("/", auth, async (req, res) => {
  try {
    res.json({
      message: "Activities API working",
      activities: [],
    });
  } catch (error) {
    console.error("Activities error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET activity stats
router.get("/stats", auth, async (req, res) => {
  try {
    res.json({
      totalActivities: 0,
      lastActivity: null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CLEAR activities
router.delete("/", auth, async (req, res) => {
  try {
    res.json({ message: "Activities cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
