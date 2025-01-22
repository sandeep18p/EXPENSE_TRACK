// Mock API response
const apiUrl = "https://your-backend-api.com/api/expenses";
let expensesData = [];

// Fetch data from backend
async function fetchExpenses(filter = "all") {
  try {
    const response = await fetch(`${apiUrl}?filter=${filter}`);
    const data = await response.json();
    expensesData = data;
    renderTable(data);
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

// Render table
function renderTable(data) {
  const tableBody = document.querySelector("#expensesTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.description}</td>
      <td>${item.category}</td>
      <td>${item.income ? item.income.toFixed(2) : "-"}</td>
      <td>${item.expense ? item.expense.toFixed(2) : "-"}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Handle filter application
document.querySelector("#applyFilter").addEventListener("click", () => {
  const filter = document.querySelector("#filter").value;
  fetchExpenses(filter);
});

// Download button functionality
document.querySelector("#downloadButton").addEventListener("click", () => {
  alert("This feature is only available for premium users!");
});

// Initialize with all data
fetchExpenses();
