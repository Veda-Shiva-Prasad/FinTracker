import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Tag, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Add category
  const addCategory = async () => {
    if (!name) {
      toast.error("Category name required");
      return;
    }

    try {
      await api.post("/api/categories", {
        name: name,
        type: type,
      });

      toast.success("Category added");

      setName("");
      setType("expense");

      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
          <Tag className="text-blue-500" /> Categories
        </h1>

        {/* Add Category */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl flex gap-2 items-center"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow"
              >
                <h3 className="font-bold dark:text-white">{cat.name}</h3>

                <p className="text-sm text-gray-400 mt-1">{cat.type}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
