const express = require("express");
const Recurring = require("../models/Recurring");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const recurring = await Recurring.find({ userId: req.user._id });
    res.json(recurring);
  } catch (error) {
    console.error("Get recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      amount,
      category,
      type,
      frequency,
      startDate,
      endDate,
      description,
    } = req.body;

    const start = new Date(startDate);
    const nextDate = new Date(start);

    const recurring = new Recurring({
      userId: req.user._id,
      name,
      amount,
      category,
      type,
      frequency,
      startDate: start,
      endDate: endDate ? new Date(endDate) : null,
      description,
      nextDate,
    });

    await recurring.save();
    res.status(201).json(recurring);
  } catch (error) {
    console.error("Create recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const recurring = await Recurring.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true },
    );

    if (!recurring) {
      return res
        .status(404)
        .json({ message: "Recurring transaction not found" });
    }

    res.json(recurring);
  } catch (error) {
    console.error("Update recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const recurring = await Recurring.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recurring) {
      return res
        .status(404)
        .json({ message: "Recurring transaction not found" });
    }

    res.json({ message: "Recurring transaction deleted successfully" });
  } catch (error) {
    console.error("Delete recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/pause", auth, async (req, res) => {
  try {
    const recurring = await Recurring.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: "paused" },
      { new: true },
    );

    if (!recurring) {
      return res
        .status(404)
        .json({ message: "Recurring transaction not found" });
    }

    res.json(recurring);
  } catch (error) {
    console.error("Pause recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/resume", auth, async (req, res) => {
  try {
    const recurring = await Recurring.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: "active" },
      { new: true },
    );

    if (!recurring) {
      return res
        .status(404)
        .json({ message: "Recurring transaction not found" });
    }

    res.json(recurring);
  } catch (error) {
    console.error("Resume recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/process", auth, async (req, res) => {
  try {
    const now = new Date();

    const dueRecurring = await Recurring.find({
      userId: req.user._id,
      status: "active",
      nextDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    });

    const processed = [];

    for (const item of dueRecurring) {
      const transaction = new Transaction({
        userId: req.user._id,
        type: item.type,
        amount: item.amount,
        category: item.category,
        note: `Recurring: ${item.name}`,
        date: now,
      });

      await transaction.save();

      const nextDate = new Date(item.nextDate);
      switch (item.frequency) {
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "yearly":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      item.lastProcessed = now;
      item.nextDate = nextDate;
      await item.save();

      processed.push({
        recurring: item.name,
        transaction: transaction._id,
      });
    }

    res.json({ processed: processed.length, details: processed });
  } catch (error) {
    console.error("Process recurring error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
