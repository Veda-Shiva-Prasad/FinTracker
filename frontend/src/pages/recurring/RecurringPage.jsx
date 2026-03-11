import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import RecurringManager from "../../components/recurring/RecurringManager";
import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  pauseRecurringTransaction,
  resumeRecurringTransaction,
} from "../../services/features/recurring";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const RecurringPage = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecurring, setEditingRecurring] = useState(null);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    try {
      const response = await getRecurringTransactions();
      setRecurring(response.data);
    } catch (err) {
      toast.error("Failed to load recurring transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    try {
      const response = await createRecurringTransaction(data);
      setRecurring([...recurring, response.data]);
      toast.success("Recurring transaction added");
    } catch (err) {
      toast.error("Failed to add recurring transaction");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateRecurringTransaction(id, data);
      await fetchRecurring();
      setEditingRecurring(null);
      toast.success("Recurring transaction updated");
    } catch (err) {
      toast.error("Failed to update recurring transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurringTransaction(id);
      setRecurring(recurring.filter((r) => r._id !== id));
      toast.success("Recurring transaction deleted");
    } catch (err) {
      toast.error("Failed to delete recurring transaction");
    }
  };

  const handlePause = async (id) => {
    try {
      await pauseRecurringTransaction(id);
      await fetchRecurring();
      toast.success("Recurring transaction paused");
    } catch (err) {
      toast.error("Failed to pause recurring transaction");
    }
  };

  const handleResume = async (id) => {
    try {
      await resumeRecurringTransaction(id);
      await fetchRecurring();
      toast.success("Recurring transaction resumed");
    } catch (err) {
      toast.error("Failed to resume recurring transaction");
    }
  };

  const handleEditClick = (recurring) => {
    setEditingRecurring(recurring);
  };

  const handleEditCancel = () => {
    setEditingRecurring(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
        >
          Recurring Transactions
        </motion.h1>

        <RecurringManager
          recurring={recurring}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onPause={handlePause}
          onResume={handleResume}
          onEditClick={handleEditClick}
          editingRecurring={editingRecurring}
          onEditCancel={handleEditCancel}
        />
      </div>
    </>
  );
};

export default RecurringPage;
