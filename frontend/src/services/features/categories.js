import API from "../api";


export const getCategories = () => API.get("/api/categories");

/**
 * Create new category
 * @param {Object} categoryData - { name, type, icon, color, subcategories }
 */
export const createCategory = (categoryData) =>
  API.post("/api/categories", categoryData);

/**
 * Update category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 */
export const updateCategory = (id, categoryData) =>
  API.put(`/api/categories/${id}`, categoryData);

/**
 * Delete category
 * @param {string} id - Category ID
 */
export const deleteCategory = (id) => API.delete(`/api/categories/${id}`);

/**
 * Add subcategory to category
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryName - Subcategory name
 */
export const addSubcategory = (categoryId, subcategoryName) =>
  API.post(`/api/categories/${categoryId}/subcategories`, {
    name: subcategoryName,
  });

/**
 * Delete subcategory
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID
 */
export const deleteSubcategory = (categoryId, subcategoryId) =>
  API.delete(`/api/categories/${categoryId}/subcategories/${subcategoryId}`);
