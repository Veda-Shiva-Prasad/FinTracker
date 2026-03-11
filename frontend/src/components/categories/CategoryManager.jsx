import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const CategoryManager = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onAddSubcategory,
  onDeleteSubcategory,
  onEditClick,
  editingCategory,
  onEditCancel,
}) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense",
    color: "#0088FE",
    icon: "💰",
  });
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({});
  const [editForm, setEditForm] = useState({ name: "", icon: "", color: "" });

  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
  ];
  const icons = [
    "💰",
    "🍔",
    "🚗",
    "🏠",
    "📱",
    "💊",
    "📚",
    "💼",
    "🎮",
    "👕",
    "✈️",
    "🎵",
  ];

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }
    onAdd(newCategory);
    setNewCategory({ name: "", type: "expense", color: "#0088FE", icon: "💰" });
  };

  const handleAddSubcategory = (categoryId) => {
    const name = newSubcategory[categoryId];
    if (!name) {
      toast.error("Subcategory name is required");
      return;
    }
    onAddSubcategory(categoryId, name);
    setNewSubcategory((prev) => ({ ...prev, [categoryId]: "" }));
  };

  const handleEditClick = (category) => {
    setEditForm({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    onEditClick(category);
  };

  const handleEditSave = (categoryId) => {
    if (!editForm.name) {
      toast.error("Category name is required");
      return;
    }
    onUpdate(categoryId, editForm);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Manage Categories
      </h2>

      {/* Add New Category */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Add New Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
          <select
            value={newCategory.type}
            onChange={(e) =>
              setNewCategory({ ...newCategory, type: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
            value={newCategory.color}
            onChange={(e) =>
              setNewCategory({ ...newCategory, color: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            style={{ backgroundColor: newCategory.color + "20" }}
          >
            {colors.map((color) => (
              <option
                key={color}
                value={color}
                style={{ backgroundColor: color }}
              >
                {color}
              </option>
            ))}
          </select>
          <select
            value={newCategory.icon}
            onChange={(e) =>
              setNewCategory({ ...newCategory, icon: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          >
            {icons.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FiPlus /> Add
          </motion.button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            {/* Category Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleExpand(category._id)}
              style={{ backgroundColor: category.color + "10" }}
            >
              {editingCategory?._id === category._id ? (
                // Edit Mode
                <div
                  className="flex items-center gap-4 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Name"
                  />
                  <select
                    value={editForm.icon}
                    onChange={(e) =>
                      setEditForm({ ...editForm, icon: e.target.value })
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    {icons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm({ ...editForm, color: e.target.value })
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditSave(category._id)}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                      title="Save"
                    >
                      <FiCheck size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onEditCancel}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                      title="Cancel"
                    >
                      <FiX size={18} />
                    </motion.button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.type} • {category.subcategories?.length || 0}{" "}
                      subcategories
                    </p>
                  </div>
                </div>
              )}

              {editingCategory?._id !== category._id && (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(category);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this category?")) {
                        onDelete(category._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </motion.button>
                  <button
                    className="p-2 text-gray-600 dark:text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(category._id);
                    }}
                  >
                    {expandedCategories.includes(category._id) ? (
                      <FiChevronUp size={18} />
                    ) : (
                      <FiChevronDown size={18} />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Subcategories */}
            <AnimatePresence>
              {expandedCategories.includes(category._id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900"
                >
                  {/* Add Subcategory */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="New subcategory"
                      value={newSubcategory[category._id] || ""}
                      onChange={(e) =>
                        setNewSubcategory({
                          ...newSubcategory,
                          [category._id]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddSubcategory(category._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <FiPlus /> Add
                    </motion.button>
                  </div>

                  {/* Subcategories List */}
                  <div className="space-y-2">
                    {category.subcategories?.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {sub.name}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            onDeleteSubcategory(category._id, sub._id)
                          }
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete subcategory"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
