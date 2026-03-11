const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all transactions for user
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add new transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      type,
      amount,
      category,
      note,
      date: date || new Date(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Export transactions as CSV
router.get("/export", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found to export" });
    }

    // CSV headers
    const headers = "Date,Type,Amount,Category,Note\n";

    // CSV rows
    const rows = transactions
      .map(
        (t) =>
          `"${new Date(t.date).toLocaleDateString()}","${t.type}","${
            t.amount
          }","${t.category}","${t.note || ""}"`
      )
      .join("\n");

    const csv = headers + rows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions-${Date.now()}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Export failed", error: error.message });
  }
});

// Import transactions from CSV
router.post("/import", auth, async (req, res) => {
  try {
    const { transactions: csvTransactions } = req.body;
    let importedCount = 0;
    let errors = [];

    for (const tx of csvTransactions) {
      try {
        const transaction = new Transaction({
          userId: req.user._id,
          type: tx.type,
          amount: parseFloat(tx.amount),
          category: tx.category,
          note: tx.note || "",
          date: tx.date ? new Date(tx.date) : new Date(),
        });

        await transaction.save();
        importedCount++;
      } catch (error) {
        errors.push(`Failed to import: ${tx.category} - ${tx.amount}`);
      }
    }

    res.json({
      message: `Imported ${importedCount} transactions successfully`,
      importedCount,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
