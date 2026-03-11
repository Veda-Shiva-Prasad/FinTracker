import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiTrendingUp,
} from "react-icons/fi";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
} from "../../services/features/goals";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "savings",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data);
    } catch (err) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGoal(formData);
      await fetchGoals();
      setShowForm(false);
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
        category: "savings",
      });
      toast.success("Goal created successfully");
    } catch (err) {
      toast.error("Failed to create goal");
    }
  };

  const handleContribute = async (goalId) => {
    const amount = prompt("Enter amount to contribute:");
    if (!amount) return;

    try {
      await addContribution(goalId, parseFloat(amount));
      await fetchGoals();
      toast.success("Contribution added");
    } catch (err) {
      toast.error("Failed to add contribution");
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeRemaining = (deadline) => {
    const days = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Savings Goals
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> New Goal
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create New Goal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="number"
                placeholder="Target Amount (₹)"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="date"
                placeholder="Deadline"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="savings">Savings</option>
                <option value="emergency">Emergency Fund</option>
                <option value="investment">Investment</option>
                <option value="travel">Travel</option>
                <option value="purchase">Big Purchase</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create Goal
              </button>
            </div>
          </motion.form>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(
              goal.currentAmount,
              goal.targetAmount,
            );
            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {goal.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleContribute(goal._id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                    >
                      <FiTrendingUp />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal._id).then(fetchGoals)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{goal.currentAmount} / ₹{goal.targetAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-3 rounded-full ${
                        progress < 50
                          ? "bg-yellow-500"
                          : progress < 80
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {getTimeRemaining(goal.deadline)}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {progress.toFixed(1)}% complete
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SavingsGoalsPage;
