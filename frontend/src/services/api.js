import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Global response error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    if (!error.response) {
      console.error("Network error - backend may be down");
    }

    return Promise.reject(error);
  },
);

// ============================================
// AUTHENTICATION APIS
// ============================================
export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const register = (name, email, password) =>
  API.post("/auth/register", { name, email, password });

export const getCurrentUser = () => API.get("/auth/me");

// ============================================
// TRANSACTION APIS
// ============================================
export const getTransactions = () => API.get("/transactions");

export const addTransaction = (transactionData) =>
  API.post("/transactions", transactionData);

export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const exportTransactions = () =>
  API.get("/transactions/export", {
    responseType: "blob",
  });

export const importTransactions = (formData) =>
  API.post("/transactions/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ============================================
// BUDGET APIS
// ============================================
export const getBudget = () => API.get("/budgets/current");
export const setBudget = (budgetData) => API.post("/budgets", budgetData);
export const getBudgetByMonth = (month, year) =>
  API.get(`/budgets/${month}/${year}`);

// ============================================
// CATEGORY APIS
// ============================================
export const getCategories = () => API.get("/categories");
export const createCategory = (categoryData) =>
  API.post("/categories", categoryData);
export const updateCategory = (id, categoryData) =>
  API.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
export const addSubcategory = (categoryId, name) =>
  API.post(`/categories/${categoryId}/subcategories`, { name });
export const deleteSubcategory = (categoryId, subcategoryId) =>
  API.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);

// ============================================
// RECURRING APIS
// ============================================
export const getRecurringTransactions = () => API.get("/recurring");
export const createRecurringTransaction = (data) =>
  API.post("/recurring", data);
export const updateRecurringTransaction = (id, data) =>
  API.put(`/recurring/${id}`, data);
export const deleteRecurringTransaction = (id) =>
  API.delete(`/recurring/${id}`);
export const pauseRecurringTransaction = (id) =>
  API.put(`/recurring/${id}/pause`);
export const resumeRecurringTransaction = (id) =>
  API.put(`/recurring/${id}/resume`);

// ============================================
// GOALS APIS
// ============================================
export const getGoals = () => API.get("/goals");
export const createGoal = (goalData) => API.post("/goals", goalData);
export const updateGoal = (id, goalData) => API.put(`/goals/${id}`, goalData);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
export const addContribution = (id, amount) =>
  API.post(`/goals/${id}/contribute`, { amount });

// ============================================
// REPORTS APIS
// ============================================
export const getMonthlyReport = (year, month) =>
  API.get(`/reports/monthly/${year}/${month}`, { responseType: "blob" });
export const getYearlyReport = (year) =>
  API.get(`/reports/yearly/${year}`, { responseType: "blob" });
export const exportReportPDF = (type, year, month) =>
  API.get(`/reports/export/${type}/${year}/${month}`, {
    responseType: "blob",
  });

// ============================================
// INSIGHTS APIS
// ============================================
export const getInsights = () => API.get("/insights");
export const getSpendingTrends = (period = "monthly") =>
  API.get(`/insights/trends/${period}`);
export const getAnomalies = () => API.get("/insights/anomalies");
export const getPredictions = () => API.get("/insights/predictions");
export const getSmartSuggestions = () => API.get("/insights/suggestions");

// ============================================
// ACTIVITY APIS
// ============================================
export const getActivities = (limit = 50) =>
  API.get(`/activities?limit=${limit}`);
export const getActivityStats = () => API.get("/activities/stats");
export const clearActivities = () => API.delete("/activities");

// ============================================
// SETTINGS APIS
// ============================================
export const getSettings = () => API.get("/settings");
export const updateSettings = (settings) => API.put("/settings", settings);
export const updateProfile = (profileData) =>
  API.put("/settings/profile", profileData);
export const changePassword = (passwordData) =>
  API.put("/settings/password", passwordData);

// ============================================
// DEFAULT EXPORT
// ============================================
export default API;
