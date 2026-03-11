const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// GET user settings
router.get("/", auth, async (req, res) => {
  try {
    res.json({
      message: "Settings API working",
      settings: {
        currency: "INR",
        theme: "light",
        notifications: true,
      },
    });
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE settings
router.put("/", auth, async (req, res) => {
  try {
    const settings = req.body;

    res.json({
      message: "Settings updated",
      settings,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
