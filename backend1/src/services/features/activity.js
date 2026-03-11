import API from "../api";

export const getActivities = (limit = 50) =>
  API.get(`/api/activities?limit=${limit}`);

export const getActivityStats = () => API.get("/api/activities/stats");

export const clearActivities = () => API.delete("/api/activities");
