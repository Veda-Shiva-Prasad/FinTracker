import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request:", config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
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

export const login = (email, password) =>
  API.post("/api/auth/login", { email, password });

export const register = (name, email, password) =>
  API.post("/api/auth/register", { name, email, password });

export const getCurrentUser = () => API.get("/api/auth/me");

export const getTransactions = () => API.get("/api/transactions");

export const addTransaction = (transactionData) =>
  API.post("/api/transactions", transactionData);

export const deleteTransaction = (id) => API.delete(`/api/transactions/${id}`);

export const exportTransactions = () =>
  API.get("/api/transactions/export", { responseType: "blob" });

export const importTransactions = (formData) =>
  API.post("/api/transactions/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getBudget = () => API.get("/api/budgets/current");

export const setBudget = (budgetData) => API.post("/api/budgets", budgetData);

export const getBudgetByMonth = (month, year) =>
  API.get(`/api/budgets/${month}/${year}`);

export default API;
