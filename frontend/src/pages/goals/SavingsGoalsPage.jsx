import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/api/goals");
      setGoals(res.data || []);
    } catch {
      toast.error("Failed to load goals");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingGoal) {
        await api.put(`/api/goals/${editingGoal._id}`, formData);
        toast.success("Goal updated successfully");
      } else {
        await api.post("/api/goals", formData);
        toast.success("Goal created successfully");
      }

      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        name: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
      });

      fetchGoals();
    } catch {
      toast.error("Failed to save goal");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData(goal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      await api.delete(`/api/goals/${id}`);
      toast.success("Goal deleted");
      fetchGoals();
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  const calculateProgress = (saved, target) => {
    return Math.min((saved / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🎯 Savings Goals
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your financial targets
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingGoal(null);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus />
            New Goal
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              {editingGoal ? "Edit Goal" : "Create Goal"}
            </h3>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Goal name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

              <input
                name="targetAmount"
                type="number"
                placeholder="Target amount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                required
                className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

              <input
                name="savedAmount"
                type="number"
                placeholder="Saved amount"
                value={formData.savedAmount}
                onChange={handleInputChange}
                required
                className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

              <div className="col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Save Goal
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 dark:bg-gray-700 px-5 py-2 rounded-lg dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {goals.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No savings goals yet
            </p>
          )}

          {goals.map((goal) => {
            const progress = calculateProgress(
              goal.savedAmount,
              goal.targetAmount,
            );

            return (
              <div
                key={goal._id}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {goal.name}
                    </h3>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-500"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  ₹{goal.savedAmount} / ₹{goal.targetAmount}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>{progress.toFixed(0)}%</span>
                  <span>
                    {Math.ceil(
                      (new Date(goal.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
