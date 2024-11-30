// index.js

// DOM elements
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const expenseContainer = document.getElementById('expense-container');
const transactions = [];

// Toggle between Login and Sign-Up
document.getElementById('goto-signup').addEventListener('click', function (e) {
  e.preventDefault();
  loginContainer.style.display = 'none';
  signupContainer.style.display = 'block';
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
    await fetchTransactionsFromDB();
  }
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async function () {
  await logOutUser();
  expenseContainer.style.display = 'none';
  loginContainer.style.display = 'block';
  transactions.length = 0; // Clear transaction list
});

// Date default to current date
document.getElementById('date').valueAsDate = new Date();

// Handle transaction form submission
document.getElementById('transaction-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
  const comment = document.getElementById('comment').value;

  if (!amount || isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  await saveTransactionToDB(amount, date, comment);
  e.target.reset();
  document.getElementById('date').valueAsDate = new Date();
});

// Delete transaction
window.deleteTransaction = async function (id) {
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index !== -1) {
    await deleteTransactionFromDB(id);
    transactions.splice(index, 1);
    displayTransactions(transactions);
  }
};

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