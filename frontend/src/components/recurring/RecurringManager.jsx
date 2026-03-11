import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiPause,
  FiPlay,
  FiClock,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const RecurringManager = ({
  recurring,
  onAdd,
  onUpdate,
  onDelete,
  onPause,
  onResume,
  onEditClick,
  editingRecurring,
  onEditCancel,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    frequency: "monthly",
    type: "expense",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    amount: "",
    category: "",
    frequency: "",
    type: "",
    description: "",
  });

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom" },
  ];

  const categories = [
    "Rent",
    "Electricity",
    "Water",
    "Internet",
    "Phone",
    "Netflix",
    "Spotify",
    "Gym",
    "Insurance",
    "EMI",
    "Subscription",
    "Salary",
    "Freelance",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }
    onAdd(formData);
    setFormData({
      name: "",
      amount: "",
      category: "",
      frequency: "monthly",
      type: "expense",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      description: "",
    });
    setShowForm(false);
  };

  const handleEditClick = (item) => {
    setEditForm({
      name: item.name,
      amount: item.amount,
      category: item.category,
      frequency: item.frequency,
      type: item.type,
      description: item.description || "",
    });
    onEditClick(item);
  };

  const handleEditSave = (id) => {
    if (!editForm.name || !editForm.amount || !editForm.category) {
      toast.error("Please fill all required fields");
      return;
    }
    onUpdate(id, editForm);
  };

  const getNextDate = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        break;
    }
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recurring Transactions
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> New Recurring
        </motion.button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Add Recurring Transaction
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Amount *"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              required
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            >
              {frequencies.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            />
            <input
              type="date"
              placeholder="End Date (optional)"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Recurring List */}
      <div className="space-y-4">
        {recurring.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 border rounded-xl ${
              item.status === "paused"
                ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {editingRecurring?._id === item._id ? (
              // Edit Mode
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Amount"
                  />
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editForm.frequency}
                    onChange={(e) =>
                      setEditForm({ ...editForm, frequency: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    {frequencies.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Description"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditSave(item._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FiSave /> Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onEditCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      item.type === "income"
                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                    }`}
                  >
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ₹{item.amount}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {item.frequency}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Next: {getNextDate(item.startDate, item.frequency)}
                      </span>
                      {item.status === "paused" && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            Paused
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === "paused" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onResume(item._id)}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                      title="Resume"
                    >
                      <FiPlay />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onPause(item._id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg"
                      title="Pause"
                    >
                      <FiPause />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (
                        window.confirm("Delete this recurring transaction?")
                      ) {
                        onDelete(item._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecurringManager;
