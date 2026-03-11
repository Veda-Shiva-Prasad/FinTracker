import API from "../api";

export const getNotifications = () => API.get("/api/notifications");

export const markAsRead = (id) => API.put(`/api/notifications/${id}/read`);

export const markAllAsRead = () => API.put("/api/notifications/read-all");

export const deleteNotification = (id) =>
  API.delete(`/api/notifications/${id}`);

export const getNotificationSettings = () =>
  API.get("/api/notifications/settings");

export const updateNotificationSettings = (settings) =>
  API.put("/api/notifications/settings", settings);
