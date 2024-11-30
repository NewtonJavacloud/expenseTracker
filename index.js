// index.js

// DOM elements
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const expenseContainer = document.getElementById('expense-container');
let transactions = [];

// Toggle between Login and Sign-Up
document.getElementById('goto-signup').addEventListener('click', function (e) {
  e.preventDefault();
  signupContainer.style.display = 'block';
  loginContainer.style.display = 'none';
});

document.getElementById('goto-login').addEventListener('click', function (e) {
  e.preventDefault();
  signupContainer.style.display = 'none';
  loginContainer.style.display = 'block';
});

// Handle Sign-Up Form Submission
document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const pin = document.getElementById('signup-pin').value;

  const success = await signUpUser(name, pin);
  if (success) {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  }
});

// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const pin = document.getElementById('pin').value;

  const success = await logInUser(name, pin);
  if (success) {
    loginContainer.style.display = 'none';
    expenseContainer.style.display = 'block';
    transactions.length = 0; // Clear old data
    const fetchedTransactions = await fetchTransactionsFromDB();
    transactions.push(...fetchedTransactions); // Populate transactions
    displayTransactions(transactions); // Show on UI
  }
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async function () {
  await logOutUser();
  expenseContainer.style.display = 'none';
  loginContainer.style.display = 'block';
  transactions.length = 0; // Clear transaction list
});

// Date default to current date and time
document.getElementById('date').valueAsDate = new Date();
document.getElementById('time').value = new Date().toTimeString().split(' ')[0].substring(0, 5);

// Handle transaction form submission
document.getElementById('transaction-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const dateInput = document.getElementById('date').value;
  const timeInput = document.getElementById('time').value;
  const dateTime = new Date(`${dateInput}T${timeInput}`);
  const correctDateTime = dateTime; // Store as Date object
  const comment = document.getElementById('comment').value;

  if (!amount || isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  const savedTransaction = await saveTransactionToDB(amount, correctDateTime, comment);
  transactions.push({
    id: savedTransaction.id,
    amount,
    date: correctDateTime,
    comment,
  });
  displayTransactions(transactions); // Update display immediately
  e.target.reset();
  document.getElementById('date').valueAsDate = new Date();
  document.getElementById('time').value = new Date().toTimeString().split(' ')[0].substring(0, 5);
});

// Filter transactions by month/year
window.filterByMonthYear = function () {
  const selectedMonthYear = document.getElementById('month-filter').value;
  if (selectedMonthYear) {
    const filtered = transactions.filter(t => t.date.startsWith(selectedMonthYear));
    displayTransactions(filtered);
  } else {
    displayTransactions(transactions);
  }
};

// Initial load of transactions from Back4App
document.addEventListener('DOMContentLoaded', async function () {
  transactions = await fetchTransactionsFromDB();
  displayTransactions(transactions);
});

// Helper functions for Back4App
async function signUpUser(name, pin) {
  // Implement sign-up logic using Back4App
}

async function logInUser(name, pin) {
  // Implement login logic using Back4App
}

async function logOutUser() {
  // Implement logout logic using Back4App
}
