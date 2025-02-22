

const expenseForm = document.getElementById('expense-form');
const expensesList = document.getElementById('expenses');
const apiUrl = 'http://localhost:3000/expenses';
let currentPage = 1;
let totalPages = 1; // Assuming there's at least one page of expenses

document.addEventListener('DOMContentLoaded', async function() {
     const parseD =  parseJwt(localStorage.getItem('authToken'));
     console.log(parseD);
     if(parseD.isPremium === false) {
       document.getElementById('report-generation').style.display = 'none'; 
       document.getElementById('show').style.display = 'none'; 
     }else{
      document.getElementById('premium-message').style.display = 'block'; 
      document.getElementById('make-payment').style.display = 'none'; 
     }
})

document.getElementById('showData').addEventListener('click', async function() { 
  fetchExpenses(currentPage);
})

const itemsPerPageSelect = document.getElementById('items-per-page');
let itemsPerPage = localStorage.getItem('itemsPerPage') || 5;

itemsPerPageSelect.value = itemsPerPage;

itemsPerPageSelect.addEventListener('change', function() {
  itemsPerPage = parseInt(this.value);
  localStorage.setItem('itemsPerPage', itemsPerPage);
  fetchExpenses(1);
});


async function fetchExpenses(page) {
  try {
    const token = localStorage.getItem('authToken');
    itemsPerPage = localStorage.getItem('itemsPerPage') || 5;

    const response = await axios.get(`${apiUrl}?page=${page}&limit=${itemsPerPage}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const expenses = response.data.expenses;
    totalPages = response.data.totalPages;
    currentPage = page;

    expensesList.innerHTML = '';
    expenses.forEach(expense => {
      addExpenseToDOM(expense);
    });

    updatePaginationControls();
  } catch (error) {
    alert('Failed to fetch expenses. Please try again.');
  }
}


async function addExpense(event) {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;

  const expense = {
    amount,
    description,
    category
  };

  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(apiUrl, expense, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      alert('Expense added successfully!');
      fetchExpenses(currentPage); // Refresh the list of expenses
    }
  } catch (error) {
    alert('Failed to add expense. Please try again.');
  }
}

function editExpense(expenseId) {
  document.getElementById("editExpenseForm").style.display = "block";
  document.getElementById("expenseForm").dataset.expenseId = expenseId;
  console.log(expenseId);

  document.getElementById("expenseForm").addEventListener("submit", async function(event) {
      event.preventDefault();

      const amount = document.getElementById("amount1").value.trim();
      const category = document.getElementById("category1").value.trim();
      const description = document.getElementById("description1").value.trim();

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
          alert("Please enter a valid amount.");
          return;
      }
      if (!category) {
          alert("Please enter a valid category.");
          return;
      }
      if (!description) {
          alert("Please enter a valid description.");
          return;
      }
      const obj = { expenseId, amount, category, description };
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${apiUrl}/editExpense`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Expense updated successfully");
            document.getElementById("editExpenseForm").style.display = "none";
        } else {
            alert(result.message || "Error updating expense");
        }
    } catch (error) {
        console.error("Error updating expense:", error);
        alert("An error occurred while updating the expense");
    }
    
  });

  document.getElementById("cancelEdit").addEventListener("click", function() {
      document.getElementById("editExpenseForm").style.display = "none";
  });
}

document.getElementById("cancelEdit").addEventListener("click", function () {
  document.getElementById("editExpenseForm").style.display = "none";
});


async function deleteExpense(expenseId) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${apiUrl}/${expenseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      alert('Expense deleted!');
      fetchExpenses(currentPage); // Refresh the list of expenses
    }
  } catch (error) {
    alert('Failed to delete expense. Please try again.');
  }
}

function addExpenseToDOM(expense) {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  li.innerHTML = `
    <span><strong>${expense.amount}</strong> - ${expense.description} (${expense.category})</span>
    <div>
      <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
      <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
    </div>
  `;
  expensesList.appendChild(li);
}

expenseForm.addEventListener('submit', addExpense);

document.getElementById('make-payment').addEventListener('click', async function() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post('http://localhost:3000/expenses/paymentOrder1/create-order', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(response.data); // Handle the response data as needed
    const { id, amount, currency } = response.data;

    var options = {
      "key": "rzp_test_99MbpBrVmBdkbi", // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. Default currency is INR.
      "currency": currency,
      "name": "Your Company Name",
      "description": "Test Transaction",
      "order_id": id, // This is the order ID returned by Razorpay
      "handler": async function (response) {
        alert('Payment successful!');
        // Handle post-payment actions here
        try {
          console.log("going")
          const updateResponse =  await axios.post('http://localhost:3000/expenses/paymentOrder1/update-status', {
            orderId: id,
            status: 'SUCCESS',
            paymentId: response.razorpay_payment_id
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (updateResponse.headers['authorization'] || updateResponse.headers['Authorization']) {
            const newToken = updateResponse.headers['authorization'] || updateResponse.headers['Authorization'];
            const authToken = newToken.split(' ')[1];
            console.log(authToken);
            localStorage.setItem('authToken', authToken);
            // Refresh the page
            window.location.reload();
          }         

        } catch (error) {
          console.error('Error updating order status:', error);
        }
      },
      "prefill": {
        "name": "Your Name",
        "email": "your.email@example.com",
        "contact": "9999999999"
      },
      "theme": {
        "color": "#3399cc"
      }
    };

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', async function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);

      // Update order status to FAILED
      try {
        await axios.post('http://localhost:3000/expenses/paymentOrder1/update-status', {
          orderId: id,
          status: 'FAILED',
          paymentId: response.error.metadata.payment_id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    });

    rzp1.open();
  } catch (error) {
    console.error('Error creating payment order:', error);
    alert('Failed to create payment order. Please try again.');
  }
});

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}



document.getElementById('show-leaderboard').addEventListener('click', async function() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('http://localhost:3000/expenses/total-expenses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data); // Handle the response data as needed
    renderUserData(response.data); // Render the user data
  } catch (error) {
    alert('Failed to fetch leaderboard. Please try again.');
  }
});

function renderUserData(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = ''; // Clear any existing content

  users.forEach(user => {
    const li = document.createElement('li');
    li.classList.add('user-item');
    li.innerHTML = `
      <div class="user-info">
        <span class="user-name">${user.name}</span>
        <span class="user-expenses">Total Expenses: ${user.totalExpenses !== null ? user.totalExpenses : 0}</span>
      </div>
    `;
    userList.appendChild(li);
  });
}

function updatePaginationControls() {
  const paginationControls = document.getElementById('pagination-controls');
  paginationControls.innerHTML = '';

  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('btn', 'btn-custom');
    prevButton.addEventListener('click', () => fetchExpenses(currentPage - 1));
    paginationControls.appendChild(prevButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('btn', 'btn-custom');
    nextButton.addEventListener('click', () => fetchExpenses(currentPage + 1));
    paginationControls.appendChild(nextButton);
  }
}


document.getElementById('report-generation').addEventListener('click', function() {
  window.location.href = 'premiumReport.html'; 
});

document.getElementById('logout').addEventListener('click', function() {

  localStorage.clear();

  window.location.href = 'login.html';
});