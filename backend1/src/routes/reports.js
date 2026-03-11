const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    res.json({
      message: "Reports API working",
      data: [],
    });
  } catch (error) {
    console.error("Reports error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
