import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Wallet,
  PiggyBank,
  Target,
} from "lucide-react";

export default function AIInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/transactions");

      const data = res.data || [];

      generateInsights(data);
    } catch (err) {
      console.error(err);

      generateInsights([]);
    }

    setLoading(false);
  };

  const generateInsights = (data) => {
    // If user has no transactions show default insights

    if (!data.length) {
      setInsights([
        {
          title: "Welcome to FinTracker",
          text: "Start adding your income and expenses to unlock smart financial insights.",
          icon: <Wallet className="text-blue-500" />,
        },

        {
          title: "Track Your Spending",
          text: "Recording daily expenses helps you understand where your money goes.",
          icon: <BarChart3 className="text-green-500" />,
        },

        {
          title: "Build Savings Goals",
          text: "Create savings goals to achieve financial freedom faster.",
          icon: <Target className="text-purple-500" />,
        },

        {
          title: "Smart Budgeting Tip",
          text: "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
          icon: <Lightbulb className="text-yellow-500" />,
        },

        {
          title: "Emergency Fund",
          text: "Aim to save at least 3-6 months of expenses as emergency funds.",
          icon: <PiggyBank className="text-pink-500" />,
        },
      ]);

      return;
    }

    const income = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    const avgExpense =
      expense / (data.filter((t) => t.type === "expense").length || 1);

    const insightsList = [
      {
        title: "Total Income",
        text: `₹${income.toLocaleString()} earned`,
        icon: <TrendingUp className="text-green-500" />,
      },

      {
        title: "Total Expenses",
        text: `₹${expense.toLocaleString()} spent`,
        icon: <AlertTriangle className="text-red-500" />,
      },

      {
        title: "Average Expense",
        text: `₹${avgExpense.toFixed(2)} per transaction`,
        icon: <BarChart3 className="text-blue-500" />,
      },

      {
        title: "Current Balance",
        text: `₹${balance.toLocaleString()} remaining`,
        icon: <Cpu className="text-purple-500" />,
      },
    ];

    setInsights(insightsList);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 flex items-center gap-2">
          <Cpu className="text-indigo-500" />
          AI Financial Insights
        </h1>

        {loading && <p className="text-gray-400">Loading insights...</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow"
            >
              <div className="mb-4">{item.icon}</div>

              <h3 className="font-bold text-lg dark:text-white mb-2">
                {item.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
