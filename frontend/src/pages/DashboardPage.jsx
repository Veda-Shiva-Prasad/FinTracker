import { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  exportTransactions,
  importTransactions,
} from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiFilter,
  FiPieChart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTransactions();
    getUserInfo();
  }, [filterMonth, filterYear]);

  const getUserInfo = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        setUserName(payload.name || "User");

        const lastLoginTime = localStorage.getItem("lastLogin");
        if (lastLoginTime) {
          const date = new Date(parseInt(lastLoginTime));
          setLastLogin(
            date.toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          );
        }
      }
    } catch (err) {
      setUserName("User");
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
      await fetchTransactions();
      toast.success("Transaction added successfully");
    } catch (err) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await deleteTransaction(id);
        await fetchTransactions();
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await exportTransactions();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `FinTrackr_${new Date().toLocaleDateString()}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() + 1 === filterMonth && date.getFullYear() === filterYear
    );
  });

  const totals = filteredTransactions.reduce(
    (acc, t) => {
      t.type === "income"
        ? (acc.income += t.amount)
        : (acc.expense += t.amount);
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const balance = totals.income - totals.expense;

  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.keys(expenseByCategory).map((category) => ({
    name: category,
    value: expenseByCategory[category],
  }));

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 relative overflow-hidden font-sans">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <Navbar />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={cardVariants}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Hello, {userName}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              <FiCalendar />{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all"
            >
              <FiDownload /> Export
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Total Income",
              val: totals.income,
              icon: <FiTrendingUp />,
              color: "from-emerald-500 to-teal-600",
            },
            {
              label: "Total Expense",
              val: totals.expense,
              icon: <FiTrendingDown />,
              color: "from-rose-500 to-orange-600",
            },
            {
              label: "Current Balance",
              val: balance,
              icon: <FiDollarSign />,
              color: "from-blue-600 to-indigo-700",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group`}
            >
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-500">
                <div className="w-32 h-32 border-[12px] border-white rounded-full" />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                  {stat.icon}
                </span>
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <h2 className="text-3xl font-bold">{formatINR(stat.val)}</h2>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Add Transaction & Table */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Form Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                Quick Transaction
              </h3>
              <form
                onSubmit={handleAddTransaction}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {[
                      "Food",
                      "Rent",
                      "Salary",
                      "Shopping",
                      "Bills",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2"
                  >
                    <FiPlus /> Add Transaction
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Table Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recent Activity
                </h3>
                <div className="flex gap-2">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                    className="bg-gray-100 dark:bg-gray-800 border-none text-xs rounded-lg px-2 py-1 dark:text-gray-300 outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "short",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t._id}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {t.category}
                          </span>
                          <p className="text-xs text-gray-400">
                            {t.note || "No note"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td
                          className={`px-6 py-4 font-bold ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatINR(t.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteTransaction(t._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Analytics */}
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl p-6 shadow-2xl h-fit"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <FiPieChart className="text-blue-500" />
                Category Split
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieChartData.map((entry, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-bold dark:text-white">
                      {formatINR(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
