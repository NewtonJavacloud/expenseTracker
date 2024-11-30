// Initialize Parse
Parse.initialize("IYLHZnugAnW5yNuoGEva7KQ8aQXF8agoGatm0dPG", "CKTZ1KhUFx7EG4bpDgunsP45R2rNnrRMaJ9zGXGo");
Parse.serverURL = 'https://parseapi.back4app.com';

document.addEventListener("DOMContentLoaded", function () {
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

    try {
      const user = new Parse.User();
      user.set("username", name);
      user.set("password", pin);
      await user.signUp();
      alert("Sign-Up Successful! Please Login.");
      signupContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    } catch (error) {
      alert("Error during sign-up: " + error.message);
    }
  });

  // Handle Login Form Submission
  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const pin = document.getElementById('pin').value;

    try {
      await Parse.User.logIn(name, pin);
      loginContainer.style.display = 'none';
      expenseContainer.style.display = 'block';
      await fetchTransactionsFromDB();
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  });

  // Handle Logout
  document.getElementById('logout-btn').addEventListener('click', async function () {
    await Parse.User.logOut();
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

  // Save transaction to Back4App
  async function saveTransactionToDB(amount, date, comment) {
    const Transaction = Parse.Object.extend('Transaction');
    const transaction = new Transaction();
    const currentUser = Parse.User.current();

    transaction.set('amount', amount);
    transaction.set('date', date);
    transaction.set('comment', comment);
    transaction.set('user', currentUser); // Associate transaction with the user

    try {
      const result = await transaction.save();
      transactions.push({
        id: result.id,
        amount,
        date,
        comment
      });
      displayTransactions();
      console.log('Transaction saved:', result);
    } catch (error) {
      console.error('Error saving transaction:', error.message);
    }
  }

  // Fetch transactions from Back4App
  async function fetchTransactionsFromDB() {
    const Transaction = Parse.Object.extend('Transaction');
    const query = new Parse.Query(Transaction);
    query.equalTo('user', Parse.User.current()); // Filter transactions by user
    query.descending('createdAt');

    try {
      const results = await query.find();
      transactions.length = 0; // Clear previous transactions
      results.forEach(transaction => {
        transactions.push({
          id: transaction.id,
          amount: transaction.get('amount'),
          date: transaction.get('date').toISOString().split('T')[0],
          comment: transaction.get('comment'),
        });
      });
      displayTransactions();
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  }

  // Display transactions grouped by month/year
  function displayTransactions(filteredTransactions = transactions) {
    const transactionContainer = document.getElementById('transaction-container');
    transactionContainer.innerHTML = '';

    const groupedTransactions = groupTransactionsByMonthYear(filteredTransactions);

    Object.keys(groupedTransactions)
      .sort((a, b) => b.localeCompare(a))
      .forEach(monthYear => {
        const label = document.createElement('h3');
        label.textContent = `${new Date(monthYear).toLocaleString('default', { month: 'long' })} ${monthYear.split('-')[0]} - Total: ₹${groupedTransactions[monthYear].total.toFixed(2)}`;
        transactionContainer.appendChild(label);

        const table = document.createElement('table');
        table.classList.add('transaction-table');
        table.innerHTML = `
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${groupedTransactions[monthYear].transactions
              .sort((a, b) => b.date.localeCompare(a.date))
              .map(transaction => `
                <tr>
                  <td>${transaction.date}</td>
                  <td>₹${transaction.amount.toFixed(2)}</td>
                  <td>${transaction.comment || 'No comment'}</td>
                  <td>
                    <button onclick="deleteTransaction('${transaction.id}')" class="delete-btn">Delete</button>
                  </td>
                </tr>`)
              .join('')}
          </tbody>
        `;
        transactionContainer.appendChild(table);
      });
  }

  // Group transactions by month and year
  function groupTransactionsByMonthYear(transactions) {
    return transactions.reduce((acc, transaction) => {
      const [year, month] = transaction.date.split('-');
      const monthYear = `${year}-${month}`;
      if (!acc[monthYear]) acc[monthYear] = { total: 0, transactions: [] };
      acc[monthYear].total += transaction.amount;
      acc[monthYear].transactions.push(transaction);
      return acc;
    }, {});
  }

  // Delete transaction from UI and Back4App
  window.deleteTransaction = async function (id) {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      await deleteTransactionFromDB(id);
      transactions.splice(index, 1);
      displayTransactions();
    }
  };

  // Delete transaction from Back4App
  async function deleteTransactionFromDB(id) {
    const Transaction = Parse.Object.extend('Transaction');
    const query = new Parse.Query(Transaction);

    try {
      const transaction = await query.get(id);
      await transaction.destroy();
      console.log('Transaction deleted');
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  }

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
});