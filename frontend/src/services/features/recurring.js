import API from "../api";

/**
 * Get all recurring transactions
 */
export const getRecurringTransactions = () => API.get("/api/recurring");

/**
 * Create new recurring transaction
 * @param {Object} data - { name, amount, category, frequency, startDate, endDate, type }
 */
export const createRecurringTransaction = (data) =>
  API.post("/api/recurring", data);

/**
 * Update recurring transaction
 * @param {string} id - Recurring transaction ID
 * @param {Object} data - Updated data
 */
export const updateRecurringTransaction = (id, data) =>
  API.put(`/api/recurring/${id}`, data);

/**
 * Delete recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const deleteRecurringTransaction = (id) =>
  API.delete(`/api/recurring/${id}`);

/**
 * Pause recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const pauseRecurringTransaction = (id) =>
  API.put(`/api/recurring/${id}/pause`);

/**
 * Resume recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const resumeRecurringTransaction = (id) =>
  API.put(`/api/recurring/${id}/resume`);

/**
 * Process due recurring transactions (admin/auto)
 */
export const processDueRecurring = () => API.post("/api/recurring/process");
