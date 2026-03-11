const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all categories for user
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new category
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, icon, color, subcategories } = req.body;

    const category = new Category({
      userId: req.user._id,
      name,
      type,
      icon: icon || "💰",
      color: color || "#0088FE",
      subcategories: subcategories || [],
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, icon, color },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete category
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add subcategory
router.post("/:id/subcategories", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subcategories.push({ name });
    await category.save();

    res.json(category);
  } catch (error) {
    console.error("Add subcategory error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete subcategory
router.delete(
  "/:categoryId/subcategories/:subcategoryId",
  auth,
  async (req, res) => {
    try {
      const category = await Category.findOne({
        _id: req.params.categoryId,
        userId: req.user._id,
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.subcategories = category.subcategories.filter(
        (sub) => sub._id.toString() !== req.params.subcategoryId,
      );

      await category.save();
      res.json(category);
    } catch (error) {
      console.error("Delete subcategory error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = router;
