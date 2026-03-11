import API from "../api";

export const getInsights = () => API.get("/api/insights");

export const getSpendingTrends = (period = "monthly") =>
  API.get(`/api/insights/trends/${period}`);

export const getCategoryComparison = (month1, month2) =>
  API.get(`/api/insights/compare/${month1}/${month2}`);

export const getAnomalies = () => API.get("/api/insights/anomalies");

export const getPredictions = () => API.get("/api/insights/predictions");

export const getSmartSuggestions = () => API.get("/api/insights/suggestions");
