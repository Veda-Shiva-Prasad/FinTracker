import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/transactions");

      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate totals

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = income - expenses;

  // Monthly data for line chart

  const monthlyData = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);

    const month = date.toLocaleString("default", { month: "short" });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    }

    if (t.type === "expense") {
      monthlyData[month].expense += t.amount;
    }
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Financial Reports
        </h1>

        {/* SUMMARY CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
          >
            <p className="text-gray-400 text-sm">Income</p>

            <h2 className="text-2xl font-bold text-green-500">
              ₹{income.toLocaleString()}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
          >
            <p className="text-gray-400 text-sm">Expenses</p>

            <h2 className="text-2xl font-bold text-red-500">
              ₹{expenses.toLocaleString()}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
          >
            <p className="text-gray-400 text-sm">Savings</p>

            <h2 className="text-2xl font-bold text-blue-500">
              ₹{savings.toLocaleString()}
            </h2>
          </motion.div>
        </div>

        {/* LINE CHART */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
        >
          <h2 className="text-lg font-bold mb-6 dark:text-white">
            Monthly Financial Trend
          </h2>

          {chartData.length === 0 ? (
            <p className="text-gray-400">No transaction data</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />

                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
