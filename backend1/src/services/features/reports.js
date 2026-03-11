import API from "../api";

export const getMonthlyReport = (year, month) =>
  API.get(`/api/reports/monthly/${year}/${month}`, { responseType: "blob" });

export const getYearlyReport = (year) =>
  API.get(`/api/reports/yearly/${year}`, { responseType: "blob" });

export const getCategoryReport = (year, month) =>
  API.get(`/api/reports/category/${year}/${month}`, { responseType: "blob" });

export const exportReportPDF = (type, year, month) =>
  API.get(`/api/reports/export/${type}/${year}/${month}`, {
    responseType: "blob",
  });

export const exportReportJSON = (type, year, month) =>
  API.get(`/api/reports/export/json/${type}/${year}/${month}`);
