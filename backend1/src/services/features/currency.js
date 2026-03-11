import API from "../api";

export const getCurrencies = () => API.get("/api/currencies");

export const getExchangeRates = (base = "INR") =>
  API.get(`/api/currencies/rates/${base}`);

export const setPreferredCurrency = (currency) =>
  API.put("/api/currencies/preferred", { currency });

export const convertCurrency = (amount, from, to) =>
  API.post("/api/currencies/convert", { amount, from, to });

export const getHistoricalRates = (date, base = "INR") =>
  API.get(`/api/currencies/historical/${date}/${base}`);
