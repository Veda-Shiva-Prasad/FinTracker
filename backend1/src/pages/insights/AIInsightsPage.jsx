import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiStar,
  FiZap,
} from "react-icons/fi";
import {
  getInsights,
  getSpendingTrends,
  getAnomalies,
  getPredictions,
  getSmartSuggestions,
} from "../../services/features/insights";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const AIInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        insightsRes,
        trendsRes,
        anomaliesRes,
        predictionsRes,
        suggestionsRes,
      ] = await Promise.all([
        getInsights(),
        getSpendingTrends("monthly"),
        getAnomalies(),
        getPredictions(),
        getSmartSuggestions(),
      ]);

      setInsights(insightsRes.data);
      setTrends(trendsRes.data);
      setAnomalies(anomaliesRes.data);
      setPredictions(predictionsRes.data);
      setSuggestions(suggestionsRes.data);
    } catch (err) {
      toast.error("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          AI-Powered Insights
        </motion.h1>

        {/* Smart Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl shadow-lg ${
                insight.type === "warning"
                  ? "bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500"
                  : insight.type === "positive"
                    ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                    : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    insight.type === "warning"
                      ? "bg-orange-100 dark:bg-orange-900"
                      : insight.type === "positive"
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-blue-100 dark:bg-blue-900"
                  }`}
                >
                  {insight.type === "warning" ? (
                    <FiAlertCircle
                      className="text-orange-600 dark:text-orange-400"
                      size={24}
                    />
                  ) : insight.type === "positive" ? (
                    <FiTrendingUp
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  ) : (
                    <FiZap
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  )}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {insight.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {insight.detail}
                  </p>
                  {insight.suggestion && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      💡 {insight.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spending Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Spending Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Anomaly Detection */}
        {anomalies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-red-500" />
              Unusual Activity Detected
            </h2>
            <div className="space-y-4">
              {anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
                >
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {anomaly.message}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {anomaly.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Smart Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Predictions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiZap className="text-purple-500" />
              AI Predictions
            </h2>
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                >
                  <p className="text-purple-800 dark:text-purple-200">
                    {pred.message}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {pred.confidence}% confidence
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiStar className="text-yellow-500" />
              Smart Suggestions
            </h2>
            <div className="space-y-4">
              {suggestions.map((sugg, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <p className="text-yellow-800 dark:text-yellow-200">
                    💡 {sugg.message}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Potential savings: ₹{sugg.potentialSavings}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AIInsightsPage;
