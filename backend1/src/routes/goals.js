const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const auth = require("../middleware/auth");

// GET goals
router.get("/", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(goals);
  } catch (err) {
    console.error("Fetch goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE goal
router.post("/", auth, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, category } = req.body;

    const goal = new Goal({
      user: req.user._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category,
    });

    const savedGoal = await goal.save();
    res.json(savedGoal);
  } catch (err) {
    console.error("Create goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE goal
router.put("/:id", auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true },
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (err) {
    console.error("Update goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE goal
router.delete("/:id", auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
