console.log("FinTrackr app loaded");

// API base URL
const API_BASE = "http://localhost:5000/api";

// Theme Management
const themeToggle = document.getElementById("theme-toggle");

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);
}

function updateThemeButton(theme) {
  themeToggle.textContent =
    theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButton(newTheme);
  updateChart();
});

// App State
let transactions = [];
let editIndex = null;
let categoryChart = null;
let authToken = localStorage.getItem("authToken");
let currentFilters = { month: "", year: "", category: "", search: "" };

const form = document.getElementById("transaction-form");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const noteInput = document.getElementById("note");
const transactionList = document.getElementById("transaction-list");
const submitBtn = form.querySelector('button[type="submit"]');

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

// API Functions
async function apiRequest(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API request failed");
    return data;
  } catch (error) {
    console.error("API Error:", error);
    alert(`Error: ${error.message}`);
    throw error;
  }
}

// Transaction API Calls
async function loadTransactions() {
  try {
    const data = await apiRequest("/transactions");
    transactions = data;
    renderTransactions();
    updateSummary();
    updateChart();
  } catch (error) {
    console.error("Failed to load transactions:", error);
  }
}

async function saveTransaction(transaction) {
  return await apiRequest("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
}

async function updateTransaction(id, transaction) {
  return await apiRequest(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });
}

async function deleteTransactionAPI(id) {
  return await apiRequest(`/transactions/${id}`, { method: "DELETE" });
}

// Filters & Search
function setupFilters() {
  const monthFilter = document.getElementById("month-filter");
  const yearFilter = document.getElementById("year-filter");
  const categoryFilter = document.getElementById("category-filter");
  const searchFilter = document.getElementById("search-filter");
  const applyBtn = document.getElementById("apply-filters");
  const clearBtn = document.getElementById("clear-filters");

  applyBtn.addEventListener("click", applyFilters);
  clearBtn.addEventListener("click", clearFilters);
  yearFilter.value = new Date().getFullYear();
}

function applyFilters() {
  currentFilters = {
    month: document.getElementById("month-filter").value,
    year: document.getElementById("year-filter").value,
    category: document.getElementById("category-filter").value.toLowerCase(),
    search: document.getElementById("search-filter").value.toLowerCase(),
  };
  renderTransactions();
  updateSummary();
  updateChart();
}

function clearFilters() {
  document.getElementById("month-filter").value = "";
  document.getElementById("year-filter").value = new Date().getFullYear();
  document.getElementById("category-filter").value = "";
  document.getElementById("search-filter").value = "";
  currentFilters = { month: "", year: "", category: "", search: "" };
  renderTransactions();
  updateSummary();
  updateChart();
}

function filterTransactions(transactions) {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (
      currentFilters.month &&
      transactionDate.getMonth() + 1 != currentFilters.month
    )
      return false;
    if (
      currentFilters.year &&
      transactionDate.getFullYear() != currentFilters.year
    )
      return false;
    if (
      currentFilters.category &&
      !transaction.category.toLowerCase().includes(currentFilters.category)
    )
      return false;
    if (currentFilters.search) {
      const inCategory = transaction.category
        .toLowerCase()
        .includes(currentFilters.search);
      const inNotes =
        transaction.note &&
        transaction.note.toLowerCase().includes(currentFilters.search);
      if (!inCategory && !inNotes) return false;
    }
    return true;
  });
}

function getCategoryDataFromTransactions(transactionList) {
  const map = {};
  transactionList.forEach((t) => {
    if (t.type === "expense")
      map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return { labels: Object.keys(map), data: Object.values(map) };
}

// UI Functions
function updateSummary() {
  const filteredTransactions = filterTransactions(transactions);
  let totalIncome = 0,
    totalExpense = 0;

  filteredTransactions.forEach((t) => {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  const balance = totalIncome - totalExpense;
  totalIncomeEl.textContent = `₹${totalIncome}`;
  totalExpenseEl.textContent = `₹${totalExpense}`;
  balanceEl.textContent = `₹${balance}`;

  const balanceCard = document.getElementById("balance-card");
  balance < 0
    ? balanceCard.classList.add("negative")
    : balanceCard.classList.remove("negative");
}

function updateChart() {
  const filteredTransactions = filterTransactions(transactions);
  const { labels, data } =
    getCategoryDataFromTransactions(filteredTransactions);
  const ctx = document.getElementById("categoryChart").getContext("2d");

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const colors = isDark
    ? [
        "rgba(96, 165, 250, 0.8)",
        "rgba(52, 211, 153, 0.8)",
        "rgba(248, 113, 113, 0.8)",
        "rgba(251, 191, 36, 0.8)",
        "rgba(167, 139, 250, 0.8)",
        "rgba(251, 146, 60, 0.8)",
      ]
    : [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(234, 179, 8, 0.8)",
        "rgba(139, 92, 246, 0.8)",
        "rgba(249, 115, 22, 0.8)",
      ];

  if (categoryChart) categoryChart.destroy();
  if (labels.length === 0) {
    document.getElementById("categoryChart").innerHTML =
      '<div class="empty-state">No expense data to show chart</div>';
    return;
  }

  categoryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
          borderColor: isDark ? "#404040" : "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: isDark ? "#ffffff" : "#333333" },
        },
      },
    },
  });
}

async function deleteTransaction(index) {
  const transaction = transactions[index];
  if (confirm("Are you sure you want to delete this transaction?")) {
    try {
      await deleteTransactionAPI(transaction._id);
      transactions.splice(index, 1);
      if (editIndex === index) cancelEdit();
      else if (editIndex !== null && editIndex > index) editIndex--;
      renderTransactions();
      updateSummary();
      updateChart();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  }
}

function startEdit(index) {
  const tx = transactions[index];
  editIndex = index;
  typeInput.value = tx.type;
  amountInput.value = tx.amount;
  categoryInput.value = tx.category;
  noteInput.value = tx.note || "";
  submitBtn.textContent = "Update Transaction";
  submitBtn.style.background = "#f59e0b";
}

function cancelEdit() {
  editIndex = null;
  submitBtn.textContent = "Add Transaction";
  submitBtn.style.background = "";
  form.reset();
}

function renderTransactions() {
  transactionList.innerHTML = "";
  const filteredTransactions = filterTransactions(transactions);

  if (filteredTransactions.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.innerHTML = `<div class="empty-state"><p>No transactions found. ${
      transactions.length === 0
        ? "Add your first transaction!"
        : "Try changing your filters."
    }</p></div>`;
    transactionList.appendChild(emptyMsg);
    return;
  }

  filteredTransactions.forEach((tx, index) => {
    const originalIndex = transactions.findIndex((t) => t._id === tx._id);
    const li = document.createElement("li");
    li.classList.add("transaction-item");
    li.innerHTML = `
      <div class="transaction-info">
        <span class="transaction-type ${tx.type}">${tx.type}</span>
        <div class="transaction-details">
          <div class="transaction-amount">₹${tx.amount}</div>
          <div class="transaction-category">${tx.category}</div>
          <div class="transaction-date">${new Date(
            tx.date
          ).toLocaleDateString()}</div>
          ${tx.note ? `<div class="transaction-note">${tx.note}</div>` : ""}
        </div>
      </div>
      <div class="transaction-actions">
        <button class="btn-edit" onclick="startEdit(${originalIndex})">Edit</button>
        <button class="btn-delete" onclick="deleteTransaction(${originalIndex})">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

// Form Submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const type = typeInput.value;
  const amount = Number(amountInput.value);
  const category = categoryInput.value.trim();
  const note = noteInput.value.trim();

  if (!amount || amount <= 0) return alert("Please enter a valid amount");
  if (!category) return alert("Please enter a category");

  try {
    const transactionData = { type, amount, category, note };
    if (editIndex === null) {
      const newTransaction = await saveTransaction(transactionData);
      transactions.push(newTransaction);
    } else {
      const transactionId = transactions[editIndex]._id;
      const updatedTransaction = await updateTransaction(
        transactionId,
        transactionData
      );
      transactions[editIndex] = updatedTransaction;
    }
    renderTransactions();
    updateSummary();
    updateChart();
    cancelEdit();
  } catch (error) {
    console.error("Failed to save transaction:", error);
  }
});

form.addEventListener("reset", cancelEdit);

// Logout Functionality
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  const userWelcome = document.getElementById("user-welcome");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.name) userWelcome.textContent = `Welcome, ${user.name}!`;

  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  });
}

// Date & Time Functions
function updateCurrentTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  document.getElementById("current-time").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

function updateLastLogin() {
  let lastLogin = localStorage.getItem("lastLogin");
  const now = new Date().toISOString();
  if (!lastLogin) {
    localStorage.setItem("lastLogin", now);
    document.getElementById("last-login").textContent = "First time login!";
  } else {
    const lastLoginDate = new Date(lastLogin);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    document.getElementById(
      "last-login"
    ).textContent = `Last login: ${lastLoginDate.toLocaleDateString(
      "en-US",
      options
    )}`;
    localStorage.setItem("lastLogin", now);
  }
}

function setupDateTime() {
  updateCurrentTime();
  updateLastLogin();
  setInterval(updateCurrentTime, 1000);
}

// Budget Functions
async function loadBudget() {
  try {
    const data = await apiRequest("/budgets/current");
    displayBudget(data);
  } catch (error) {
    console.error("Failed to load budget:", error);
  }
}

function displayBudget(budgetData) {
  const budgetDisplay = document.getElementById("budget-display");
  if (budgetData.status === "no-budget") {
    budgetDisplay.innerHTML = `
      <div class="budget-card">
        <div class="budget-header">
          <div class="budget-title">No Budget Set</div>
          <span class="budget-status status-no-budget">No Budget</span>
        </div>
        <p>You haven't set a budget for this month. Set a budget below to track your spending!</p>
        <div class="budget-numbers">
          <div class="budget-number">
            <span class="label">Spent This Month</span>
            <span class="value" style="color: var(--error-color);">₹${budgetData.spent}</span>
          </div>
        </div>
      </div>`;
    return;
  }

  const { budget, spent, remaining, percentage, status } = budgetData;
  let statusClass = "status-ok",
    progressClass = "progress-ok",
    alertHtml = "";
  if (status === "warning") {
    statusClass = "status-warning";
    progressClass = "progress-warning";
    alertHtml = `<div class="budget-alert alert-warning">⚠️ You've used ${percentage}% of your budget!</div>`;
  } else if (status === "over-budget") {
    statusClass = "status-over-budget";
    progressClass = "progress-over";
    alertHtml = `<div class="budget-alert alert-danger">🚨 You've exceeded your budget by ₹${-remaining}!</div>`;
  }

  budgetDisplay.innerHTML = `
    <div class="budget-card">
      <div class="budget-header">
        <div class="budget-title">${new Date(
          budget.year,
          budget.month - 1
        ).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })} Budget</div>
        <span class="budget-status ${statusClass}">${status.replace(
    "-",
    " "
  )}</span>
      </div>
      ${alertHtml}
      <div class="budget-progress">
        <div class="progress-bar">
          <div class="progress-fill ${progressClass}" style="width: ${Math.min(
    percentage,
    100
  )}%"></div>
        </div>
        <div style="text-align: center; font-size: 0.9rem; color: var(--secondary-color);">
          ${percentage}% used (₹${spent} of ₹${budget.amount})
        </div>
      </div>
      <div class="budget-numbers">
        <div class="budget-number">
          <span class="label">Budget</span>
          <span class="value">₹${budget.amount}</span>
        </div>
        <div class="budget-number">
          <span class="label">Spent</span>
          <span class="value" style="color: var(--error-color);">₹${spent}</span>
        </div>
        <div class="budget-number">
          <span class="label">Remaining</span>
          <span class="value" style="color: ${
            remaining > 0 ? "var(--success-color)" : "var(--error-color)"
          };">₹${remaining}</span>
        </div>
      </div>
    </div>`;
}

async function setupBudgetForm() {
  const form = document.getElementById("budget-form");
  const now = new Date();
  document.getElementById("budget-month").value = now.getMonth() + 1;
  document.getElementById("budget-year").value = now.getFullYear();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const month = parseInt(document.getElementById("budget-month").value);
    const year = parseInt(document.getElementById("budget-year").value);
    const amount = parseFloat(document.getElementById("budget-amount").value);

    if (!amount || amount <= 0)
      return alert("Please enter a valid budget amount");
    try {
      await apiRequest("/budgets", {
        method: "POST",
        body: JSON.stringify({ month, year, amount }),
      });
      alert("Budget set successfully!");
      form.reset();
      document.getElementById("budget-month").value = month;
      document.getElementById("budget-year").value = year;
      loadBudget();
    } catch (error) {
      console.error("Failed to set budget:", error);
    }
  });
}

// Export/Import Functions
function setupExportImport() {
  const exportBtn = document.getElementById("export-csv");
  const importBtn = document.getElementById("import-csv");
  const fileInput = document.getElementById("csv-file");
  const importResult = document.getElementById("import-result");

  exportBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Export failed: ${response.status}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Exported file is empty");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      importResult.innerHTML =
        '<div class="import-success">✅ CSV exported successfully!</div>';
      setTimeout(() => {
        importResult.innerHTML = "";
      }, 3000);
    } catch (error) {
      console.error("Export failed:", error);
      importResult.innerHTML = `<div class="import-error">❌ Export failed: ${error.message}</div>`;
      setTimeout(() => {
        importResult.innerHTML = "";
      }, 5000);
    }
  });

  importBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    importResult.innerHTML =
      '<div class="import-info">⏳ Processing CSV file...</div>';
    try {
      const text = await readFileAsText(file);
      const transactions = parseCSV(text);
      if (transactions.length === 0)
        throw new Error("No valid transactions found in CSV");
      const result = await apiRequest("/transactions/import", {
        method: "POST",
        body: JSON.stringify({ transactions }),
      });
      importResult.innerHTML = `<div class="import-success">✅ ${
        result.message
      }<br>${
        result.errors && result.errors.length > 0
          ? `Errors: ${result.errors.join(", ")}`
          : ""
      }</div>`;
      loadTransactions();
      loadBudget();
    } catch (error) {
      console.error("Import failed:", error);
      importResult.innerHTML = `<div class="import-error">❌ Import failed: ${error.message}</div>`;
    }
    event.target.value = "";
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function parseCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0]
    .split(",")
    .map((h) => h.replace(/"/g, "").trim().toLowerCase());
  const transactions = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    const transaction = {};
    headers.forEach((header, index) => {
      transaction[header] = values[index].replace(/"/g, "").trim();
    });
    if (transaction.amount && transaction.category && transaction.type) {
      transaction.type = transaction.type.toLowerCase();
      if (transaction.type !== "income" && transaction.type !== "expense")
        transaction.type = "expense";
      if (transaction.date) {
        const parsedDate = new Date(transaction.date);
        transaction.date = isNaN(parsedDate.getTime())
          ? new Date().toISOString()
          : parsedDate.toISOString();
      } else transaction.date = new Date().toISOString();
      transactions.push(transaction);
    }
  }
  return transactions;
}

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else current += char;
  }
  values.push(current);
  return values;
}

// Initial Load
initTheme();
setupLogout();
setupFilters();
setupDateTime();
setupBudgetForm();
setupExportImport();

// Check authentication
if (!authToken) window.location.href = "login.html";
else {
  loadTransactions();
  loadBudget();
}
