import API from "../api";

export const getGoals = () => API.get("/api/goals");

export const createGoal = (goalData) => API.post("/api/goals", goalData);

export const updateGoal = (id, goalData) =>
  API.put(`/api/goals/${id}`, goalData);

export const deleteGoal = (id) => API.delete(`/api/goals/${id}`);

export const addContribution = (id, amount) =>
  API.post(`/api/goals/${id}/contribute`, { amount });

export const getGoalProgress = (id) => API.get(`/api/goals/${id}/progress`);
