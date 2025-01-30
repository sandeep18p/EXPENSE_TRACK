const API_BASE_URL = "http://localhost:3000/api/reports";
const token = localStorage.getItem("authToken");

const elements = {
  expensesTableBody: document.querySelector("#expensesTableBody"),
  tthead: document.querySelector("#tthead"),
  filterSelect: document.querySelector("#filter"),
  applyFilterButton: document.querySelector("#applyFilter"),
  downloadButton: document.querySelector("#downloadButton"),
  expenseTable: document.querySelector("#expenseTable"),
  loadingIndicator: document.querySelector("#loading"),
  errorDiv: document.querySelector("#error"),
};

let expensesData = [];

async function fetchExpenses(filter) {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/${filter}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    expensesData = data.data;
    displayExpenses(filter, expensesData);
    showError("");
  } catch (error) {
    showError("Failed to fetch expenses. Please check authentication.");
  } finally {
    showLoading(false);
  }
}

function displayExpenses(filter, data) {
  if (!Array.isArray(data) || data.length === 0) {
    showError("No expenses found for the selected filter.");
    elements.expenseTable.style.display = "none";
    return;
  }
  
  elements.expensesTableBody.innerHTML = "";
  elements.tthead.innerHTML = getTableHeaders(filter);

  data.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = getRowData(filter, expense);
    elements.expensesTableBody.appendChild(row);
  });

  elements.expenseTable.style.display = "table";
}

function getTableHeaders(filter) {
  switch (filter) {
    case "weekly": return `<tr><th>Week Number</th><th>Expense</th></tr>`;
    case "monthly": return `<tr><th>Month Number</th><th>Expense</th></tr>`;
    default: return `<tr><th>Date</th><th>Description</th><th>Category</th><th>Expense</th></tr>`;
  }
}

function getRowData(filter, expense) {
  switch (filter) {
    case "weekly": return `<td>${expense.week}</td><td>${expense.totalAmount}</td>`;
    case "monthly": return `<td>${expense.month}</td><td>${expense.totalAmount}</td>`;
    default: return `<td>${expense.date || "N/A"}</td><td>${expense.description || "N/A"}</td><td>${expense.category || "N/A"}</td><td>${expense.income || "0.00"}</td>`;
  }
}

function showLoading(show) {
  elements.loadingIndicator.style.display = show ? "block" : "none";
}

function showError(message) {
  elements.errorDiv.textContent = message;
  elements.errorDiv.style.display = message ? "block" : "none";
}

async function downloadExpenses() {
  await fetch(`${API_BASE_URL}/download`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  });
  loadDownloadedFiles();
}

async function loadDownloadedFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/downloaded-files`, { headers: { "Authorization": `Bearer ${token}` } });
    if (!response.ok) throw new Error("Failed to fetch files");

    const { files } = await response.json();
    document.getElementById("DownloadedDataList").innerHTML = files
      .map(file => `<li><a href="${file.fileURL}" target="_blank">Download File: ${file.fileURL}</a></li>`)
      .join('');
  } catch (error) {
    showError("Failed to load files.");
  }
}

elements.applyFilterButton.addEventListener("click", () => fetchExpenses(elements.filterSelect.value));
elements.downloadButton.addEventListener("click", downloadExpenses);

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Page Loaded");
//   fetchExpenses("daily");
//   loadDownloadedFiles();
// }, { once: true });
