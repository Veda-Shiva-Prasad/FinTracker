import Navbar from "../../components/Navbar";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Moon, Sun, Download, Trash2, LogOut, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const isDark = document.documentElement.classList.contains("dark");

  const toggleDark = () => {
    const enabled = document.documentElement.classList.toggle("dark");

    localStorage.setItem("theme", enabled ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const clearTransactions = async () => {
    if (!window.confirm("Delete ALL transactions?")) return;

    try {
      await api.delete("/api/transactions/clear-all");

      toast.success("All transactions deleted");

      window.location.reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportData = async () => {
    try {
      const res = await api.get("/api/transactions/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = "fintracker_data.csv";

      a.click();

      toast.success("Data exported");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Appearance */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-500" />

                <div>
                  <h3 className="font-bold dark:text-white">Appearance</h3>

                  <p className="text-sm text-gray-400">
                    Toggle dark or light mode
                  </p>
                </div>
              </div>

              <button
                onClick={toggleDark}
                className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700"
              >
                {isDark ? <Sun /> : <Moon />}
              </button>
            </div>
          </motion.div>

          {/* Export */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="text-green-500" />

                <div>
                  <h3 className="font-bold dark:text-white">
                    Export Transactions
                  </h3>

                  <p className="text-sm text-gray-400">
                    Download your transactions as CSV
                  </p>
                </div>
              </div>

              <button
                onClick={exportData}
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Export
              </button>
            </div>
          </motion.div>

          {/* Clear Data */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-500" />

                <div>
                  <h3 className="font-bold dark:text-white">Clear All Data</h3>

                  <p className="text-sm text-gray-400">
                    Delete all transactions permanently
                  </p>
                </div>
              </div>

              <button
                onClick={clearTransactions}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>
            </div>
          </motion.div>

          {/* Logout */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="text-orange-500" />

                <div>
                  <h3 className="font-bold dark:text-white">Logout</h3>

                  <p className="text-sm text-gray-400">
                    Sign out from your account
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
