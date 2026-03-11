import { useState, useEffect } from "react";
import { getBudget, setBudget, getTransactions } from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiCalendar,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import toast from "react-hot-toast";

const BudgetPage = () => {
  const [budget, setBudgetData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: "",
  });

  useEffect(() => {
    fetchBudget();
    fetchTransactions();
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await getBudget();
      if (response.data.status === "no-budget") {
        setBudgetData(null);
        setFormData((prev) => ({ ...prev, amount: "" }));
      } else {
        setBudgetData(response.data);
        setFormData({
          month: response.data.budget?.month || new Date().getMonth() + 1,
          year: response.data.budget?.year || new Date().getFullYear(),
          amount: response.data.budget?.amount || "",
        });
      }
    } catch (err) {
      setError("Failed to sync budget data.");
      toast.error("Cloud sync failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setBudget({
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        amount: parseFloat(formData.amount),
      });
      await fetchBudget();
      toast.success("Budget updated!");
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyExpenses = () => {
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() + 1 === formData.month &&
          date.getFullYear() === formData.year &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const monthlyExpenses = budget?.spent || calculateMonthlyExpenses();
  const budgetAmount = budget?.budget?.amount || 0;
  const remainingBudget = budget?.remaining || budgetAmount - monthlyExpenses;
  const progressPercentage =
    budget?.percentage ||
    (budgetAmount ? (monthlyExpenses / budgetAmount) * 100 : 0);

  const getStatusColor = () => {
    if (progressPercentage >= 100)
      return "from-rose-500 to-red-600 shadow-red-200";
    if (progressPercentage >= 85)
      return "from-amber-400 to-orange-500 shadow-orange-200";
    return "from-emerald-400 to-teal-600 shadow-teal-200";
  };

  const formatINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading && !budget) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-600 font-bold text-xl flex items-center gap-2"
        >
          <FiZap className="animate-pulse" /> Loading Engine...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-500">
      <Navbar />

      {/* Dynamic Background Blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-400 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Budget{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Analytics
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Track, optimize and master your monthly flow.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <FiCalendar className="text-blue-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {new Date(2024, formData.month - 1).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {formData.year}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              label: "Planned Budget",
              val: budgetAmount,
              icon: FiTarget,
              color: "from-blue-600 to-indigo-700",
            },
            {
              label: "Total Spent",
              val: monthlyExpenses,
              icon: FiTrendingDown,
              color: "from-slate-800 to-slate-900",
            },
            {
              label: "Remaining",
              val: remainingBudget,
              icon: FiDollarSign,
              color: getStatusColor(),
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-[2rem] p-8 text-white bg-gradient-to-br ${card.color} shadow-2xl`}
            >
              <card.icon className="absolute right-[-10px] bottom-[-10px] w-32 h-32 opacity-10 rotate-12" />
              <p className="text-white/80 font-medium uppercase tracking-wider text-xs">
                {card.label}
              </p>
              <h2 className="text-4xl font-bold mt-2">{formatINR(card.val)}</h2>

              {card.label === "Remaining" && budgetAmount > 0 && (
                <div className="mt-6">
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                      }}
                      className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                  <p className="text-sm mt-3 font-medium">
                    {progressPercentage.toFixed(1)}% of limit reached
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Configuration Form */}
          <motion.div
            variants={fadeInUp}
            className="xl:col-span-3 bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white dark:border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 dark:text-white">
              <FiPieChart className="text-indigo-500" /> Modify Constraints
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">
                    Period
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("en", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-1/3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">
                    Allocated Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 dark:text-white text-xl font-semibold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Sync Budget Plan
              </motion.button>
            </form>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            variants={fadeInUp}
            className="xl:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiZap className="text-yellow-400" /> Intelligence
              </h3>
              <div className="space-y-6">
                {[
                  {
                    t: "The 50/30/20 Strategy",
                    d: "Divide 50% for Needs, 30% Wants, and 20% for Debt/Savings.",
                  },
                  {
                    t: "Emergency Buffer",
                    d: "Keep at least 15% of this budget liquid for unplanned hits.",
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                  >
                    <p className="font-bold text-sm text-indigo-200">{tip.t}</p>
                    <p className="text-sm text-indigo-50/70 mt-1">{tip.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetPage;
