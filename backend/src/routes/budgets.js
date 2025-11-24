const express = require("express");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// Create or update budget
router.post("/", auth, async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    let budget = await Budget.findOne({
      userId: req.user._id,
      month,
      year,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = new Budget({
        userId: req.user._id,
        month,
        year,
        amount,
      });
      await budget.save();
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get current month's budget
router.get("/current", auth, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budget = await Budget.findOne({
      userId: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    // Calculate spent amount for current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const spent = expenses.reduce((total, tx) => total + tx.amount, 0);

    if (!budget) {
      return res.json({
        status: "no-budget",
        spent,
      });
    }

    const remaining = budget.amount - spent;
    const percentage = Math.round((spent / budget.amount) * 100);

    let status = "ok";
    if (percentage >= 100) {
      status = "over-budget";
    } else if (percentage >= 80) {
      status = "warning";
    }

    res.json({
      budget,
      spent,
      remaining,
      percentage,
      status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
