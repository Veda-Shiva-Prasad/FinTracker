import axios from "axios";

const API = axios.create({
  baseURL: "/api",
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

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const register = (name, email, password) =>
  API.post("/auth/register", { name, email, password });

export const getCurrentUser = () => API.get("/auth/me");

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

export const getBudget = () => API.get("/budgets/current");

export const setBudget = (budgetData) => API.post("/budgets", budgetData);

export const getBudgetByMonth = (month, year) =>
  API.get(`/budgets/${month}/${year}`);

export default API;
