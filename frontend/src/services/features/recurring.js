import API from "../api";

/**
 * Get all recurring transactions
 */
export const getRecurringTransactions = () => API.get("/recurring");

/**
 * Create new recurring transaction
 * @param {Object} data - { name, amount, category, frequency, startDate, endDate, type }
 */
export const createRecurringTransaction = (data) =>
  API.post("/recurring", data);

/**
 * Update recurring transaction
 * @param {string} id - Recurring transaction ID
 * @param {Object} data - Updated data
 */
export const updateRecurringTransaction = (id, data) =>
  API.put(`/recurring/${id}`, data);

/**
 * Delete recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const deleteRecurringTransaction = (id) =>
  API.delete(`/recurring/${id}`);

/**
 * Pause recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const pauseRecurringTransaction = (id) =>
  API.put(`/recurring/${id}/pause`);

/**
 * Resume recurring transaction
 * @param {string} id - Recurring transaction ID
 */
export const resumeRecurringTransaction = (id) =>
  API.put(`/recurring/${id}/resume`);

/**
 * Process due recurring transactions (admin/auto)
 */
export const processDueRecurring = () => API.post("/recurring/process");
