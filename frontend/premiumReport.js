// Sample expenses data for demonstration
const expensesData = [
    { date: "01-03-2021", description: "Milk", category: "Grocery", income: 0, expense: 60 },
    { date: "04-03-2021", description: "Salary", category: "Income", income: 40000, expense: 0 },
    { date: "04-03-2021", description: "Fruits", category: "Grocery", income: 0, expense: 500 },
    { date: "04-03-2021", description: "Medicines", category: "Health", income: 0, expense: 50 },
    { date: "05-03-2021", description: "Milk", category: "Grocery", income: 0, expense: 60 },
    { date: "05-03-2021", description: "Fees", category: "Education", income: 0, expense: 4000 },
    { date: "05-03-2021", description: "Party", category: "Entertainment", income: 0, expense: 500 },
    { date: "05-03-2021", description: "Travel", category: "Transport", income: 0, expense: 500 },
    // Add more entries here for testing
  ];
  
  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;
  
  // DOM elements
  const expensesTableBody = document.querySelector("#expensesTable tbody");
  const prevPageButton = document.querySelector("#prevPage");
  const nextPageButton = document.querySelector("#nextPage");
  const pageInfo = document.querySelector("#pageInfo");
  
  // Functions for pagination
  function displayExpenses(page = 1) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedExpenses = expensesData.slice(startIndex, endIndex);
  
    // Clear the table body
    expensesTableBody.innerHTML = "";
  
    // Populate the table with paginated data
    paginatedExpenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.income.toFixed(2)}</td>
        <td>${expense.expense.toFixed(2)}</td>
      `;
      expensesTableBody.appendChild(row);
    });
  
    // Update pagination controls
    updatePaginationControls();
  }
  
  function updatePaginationControls() {
    const totalPages = Math.ceil(expensesData.length / rowsPerPage);
  
    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
    // Enable/disable buttons
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }
  
  // Event listeners for pagination buttons
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayExpenses(currentPage);
    }
  });
  
  nextPageButton.addEventListener("click", () => {
    const totalPages = Math.ceil(expensesData.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayExpenses(currentPage);
    }
  });
  
  // Initial display
  displayExpenses();
  
  // Filter functionality
  const filterSelect = document.querySelector("#filter");
  const applyFilterButton = document.querySelector("#applyFilter");
  
  applyFilterButton.addEventListener("click", () => {
    const filterValue = filterSelect.value;
  
    // Apply filters (example logic)
    const filteredExpenses = expensesData.filter((expense) => {
      const expenseDate = new Date(expense.date.split("-").reverse().join("-"));
      const today = new Date();
  
      if (filterValue === "daily") {
        return expenseDate.toDateString() === today.toDateString();
      } else if (filterValue === "weekly") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return expenseDate >= oneWeekAgo && expenseDate <= today;
      } else if (filterValue === "monthly") {
        return (
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear()
        );
      } else {
        return true; // Show all expenses
      }
    });
  
    // Update the table with filtered data
    displayFilteredExpenses(filteredExpenses);
  });
  
  function displayFilteredExpenses(filteredExpenses) {
    expensesTableBody.innerHTML = "";
  
    filteredExpenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.income.toFixed(2)}</td>
        <td>${expense.expense.toFixed(2)}</td>
      `;
      expensesTableBody.appendChild(row);
    });
  
    // Update pagination controls for filtered data
    pageInfo.textContent = `Filtered Results`;
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
  }
  
  // Premium features
  const downloadButton = document.querySelector("#downloadButton");
  const isPremiumUser = false; // Set to true if user is premium
  
  function updateDownloadButtonStatus() {
    if (isPremiumUser) {
      downloadButton.disabled = false;
      downloadButton.classList.add("premium-enabled");
      downloadButton.textContent = "Download Expenses";
    } else {
      downloadButton.disabled = true;
      downloadButton.classList.remove("premium-enabled");
      downloadButton.textContent = "Download Expenses (Premium Only)";
    }
  }
  
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
  
  // Update premium button status on load
  updateDownloadButtonStatus();
  