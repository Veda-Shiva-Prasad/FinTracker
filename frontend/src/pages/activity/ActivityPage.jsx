import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

export default function ActivityPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await api.get("/api/transactions");
      // Sort by date (newest first) just in case the API doesn't
      const sortedData = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setTransactions(sortedData);
    } catch (err) {
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              📜 Activity Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Keep track of all your recent transactions
            </p>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {transactions.length} Transactions
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No transactions found yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="group flex items-center justify-between bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  {/* Category Icon Placeholder */}
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl">
                    {t.type === "income" ? "💰" : "🛒"}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      {t.category}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      t.type === "income" || t.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} ₹
                    {Math.abs(t.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                    {t.paymentMethod || "Digital"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
