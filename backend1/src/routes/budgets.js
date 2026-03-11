const express = require("express");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// Get current month's budget with spending info
router.get("/current", auth, async (req, res) => {
  try {
    console.log("Fetching budget for user:", req.user._id);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Find budget for current month
    const budget = await Budget.findOne({
      userId: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    console.log("Found budget:", budget);

    // Calculate start and end of month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Find all expense transactions for current month
    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const spent = expenses.reduce((total, tx) => total + (tx.amount || 0), 0);

    if (!budget) {
      return res.json({
        status: "no-budget",
        spent,
        message: "No budget set for this month",
      });
    }

    const remaining = budget.amount - spent;
    const percentage =
      budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

    let status = "ok";
    if (percentage >= 100) {
      status = "over-budget";
    } else if (percentage >= 80) {
      status = "warning";
    }

    res.json({
      budget: {
        _id: budget._id,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        createdAt: budget.createdAt,
      },
      spent,
      remaining,
      percentage,
      status,
    });
  } catch (error) {
    console.error("Budget fetch error details:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Create or update budget
router.post("/", auth, async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    console.log("Setting budget:", {
      userId: req.user._id,
      month,
      year,
      amount,
    });

    if (!month || !year || !amount) {
      return res
        .status(400)
        .json({ message: "Month, year, and amount are required" });
    }

    let budget = await Budget.findOne({
      userId: req.user._id,
      month,
      year,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
      console.log("Updated existing budget");
    } else {
      budget = new Budget({
        userId: req.user._id,
        month,
        year,
        amount,
      });
      await budget.save();
      console.log("Created new budget");
    }

    res.json(budget);
  } catch (error) {
    console.error("Budget set error details:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
