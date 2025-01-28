const API_BASE_URL = "http://localhost:3000/api/reports"; // Base URL for API endpoints

// Retrieve token from localStorage
const token = localStorage.getItem("authToken");

// DOM elements
const expensesTableBody = document.querySelector("#expensesTableBody");
const tthead = document.querySelector("#tthead");
const filterSelect = document.querySelector("#filter");
const applyFilterButton = document.querySelector("#applyFilter");
const downloadButton = document.querySelector("#downloadButton");
const expenseTable = document.querySelector("#expenseTable");
const loadingIndicator = document.querySelector("#loading");
const errorDiv = document.querySelector("#error");

let isPremiumUser = false; // Change to true for premium users
let expensesData = []; // Global variable to store fetched expenses

// Fetch data from API and populate the table
async function fetchExpenses(filter) {
  try {
    showLoading(true); // Show loading spinner

    const response = await fetch(`${API_BASE_URL}/${filter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch expenses: ${errorMessage}`);
    }

    const data = await response.json();
    expensesData = data.data; // Store data globally
    displayExpenses(expensesData);
    showError(""); // Clear any error message
  } catch (error) {
    console.error(error.message);
    showError("Failed to fetch expenses. Please check your authentication or try again.");
  } finally {
    showLoading(false); // Hide loading spinner
  }
}

async function fetchExpensesWeekly(filter) {
  try {
    showLoading(true); // Show loading spinner
    console.log(filter)
    const response = await fetch(`${API_BASE_URL}/${filter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch expenses: ${errorMessage}`);
    }

    const data = await response.json();
    expensesData = data.data; // Store data globally
    console.log(expensesData)
    displayExpensesWeekly(expensesData);
    showError(""); // Clear any error message
  } catch (error) {
    console.error(error.message);
    showError("Failed to fetch expenses. Please check your authentication or try again.");
  } finally {
    showLoading(false); // Hide loading spinner
  }
}

async function fetchExpensesMonthly(filter) {
  try {
    showLoading(true); // Show loading spinner
    console.log(filter)
    const response = await fetch(`${API_BASE_URL}/${filter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch expenses: ${errorMessage}`);
    }

    const data = await response.json();
    expensesData = data.data; // Store data globally
    console.log(expensesData)
    displayExpensesMonthly(expensesData);
    showError(""); // Clear any error message
  } catch (error) {
    console.error(error.message);
    showError("Failed to fetch expenses. Please check your authentication or try again.");
  } finally {
    showLoading(false); // Hide loading spinner
  }
}


// Display expenses in the table
function displayExpenses(expensesData) {
  if (!Array.isArray(expensesData)) {
    console.error("Expenses data is not an array");
    showError("Invalid data format received.");
    return;
  }

  // Clear the table body
  expensesTableBody.innerHTML = "";

  tthead.innerHTML = ` 
    <tr>
       <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Expense</th>
    </tr>
 `;

  if (expensesData.length === 0) {
    showError("No expenses found for the selected filter.");
    expenseTable.style.display = "none";
    return;
  }

  // Populate the table with data
  expensesData.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.date || "N/A"}</td>
      <td>${expense.description || "N/A"}</td>
      <td>${expense.category || "N/A"}</td>
      
   
      <td>${expense.income || "0.00"}</td>
    `;
    expensesTableBody.appendChild(row);
  });

  expenseTable.style.display = "table"; // Show table
}

function displayExpensesWeekly(expensesData) {
  if (!Array.isArray(expensesData)) {
    console.error("Expenses data is not an array");
    showError("Invalid data format received.");
    return;
  }

  // Clear the table body
  
  tthead.innerHTML = ` 
    <tr>
      <th>Week Number</th>
      <th>Expense</th>
    </tr>
 `;
  expensesTableBody.innerHTML = "";

  if (expensesData.length === 0) {
    showError("No expenses found for the selected filter.");
    expenseTable.style.display = "none";
    return;
  }

  // Populate the table with data
  expensesData.forEach((expense) => {
    console.log(expense)
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.week}</td>
      <td>${expense.totalAmount}</td>
    `;
    expensesTableBody.appendChild(row);
  });

  expenseTable.style.display = "table"; // Show table
}

function displayExpensesMonthly(expensesData) {
  if (!Array.isArray(expensesData)) {
    console.error("Expenses data is not an array");
    showError("Invalid data format received.");
    return;
  }

  // Clear the table body
  
  tthead.innerHTML = ` 
    <tr>
      <th>Month Number</th>
      <th>Expense</th>
    </tr>
 `;
  expensesTableBody.innerHTML = "";

  if (expensesData.length === 0) {
    showError("No expenses found for the selected filter.");
    expenseTable.style.display = "none";
    return;
  }

  // Populate the table with data
  expensesData.forEach((expense) => {
    console.log(expense)
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.month}</td>
      <td>${expense.totalAmount}</td>
    `;
    expensesTableBody.appendChild(row);
  });

  expenseTable.style.display = "table"; // Show table
}

// Show or hide loading spinner
function showLoading(show) {
  loadingIndicator.style.display = show ? "block" : "none";
}

// Show error messages
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = message ? "block" : "none";
}

// Download expenses as JSON
downloadButton.addEventListener("click", () => {
  if (isPremiumUser) {
    const fileContent = JSON.stringify(expensesData, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.json";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert("This feature is available only for premium users!");
  }
});

// Apply filter button click
applyFilterButton.addEventListener("click", () => {
  console.log("1")
  const filterValue = filterSelect.value;
  if(filterValue == "daily"){
    fetchExpenses(filterValue);
  }else if(filterValue == "weekly"){
    console.log("1")
    fetchExpensesWeekly(filterValue)
  }else{
    fetchExpensesMonthly(filterValue)
  }
 
});

// Initialize the app
fetchExpenses("daily"); // Fetch daily expenses by default
