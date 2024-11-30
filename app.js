document.getElementById('date').valueAsDate = new Date();
const transactions = [];

document.getElementById('transaction-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const dateInput = document.getElementById('date');
  const date = dateInput.value || new Date().toISOString().split('T')[0];
  const comment = document.getElementById('comment').value;

  if (!amount) return;

  transactions.push({ id: Date.now(), amount, date, comment });
  // Save transactions to localStorage 
  localStorage.setItem('transactions', JSON.stringify(transactions));

  displayTransactions();
  e.target.reset();
  dateInput.valueAsDate = new Date();
});

function groupTransactionsByMonthYear() {
  return transactions.reduce((acc, transaction) => {
    const [year, month] = transaction.date.split('-');
    const monthYear = `${year}-${month}`;
    if (!acc[monthYear]) acc[monthYear] = { total: 0, transactions: [] };
    acc[monthYear].total += transaction.amount;
    acc[monthYear].transactions.push(transaction);
    return acc;
  }, {});
}


function displayTransactions(filteredTransactions = transactions) {
  const transactionContainer = document.getElementById('transaction-container');
  transactionContainer.innerHTML = '';

  const groupedTransactions = groupTransactionsByMonthYear(filteredTransactions);

  Object.keys(groupedTransactions)
    .sort((a, b) => b.localeCompare(a)) // Sort months in descending order
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
                  <button onclick="deleteTransaction(${transaction.id})" class="delete-btn">Delete</button>
                </td>
              </tr>`)
            .join('')}
        </tbody>
      `;
      transactionContainer.appendChild(table);
    });
}

function deleteTransaction(id) {
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    displayTransactions();
  }
}

function filterByMonthYear() {
  const selectedMonthYear = document.getElementById('month-filter').value;
  if (selectedMonthYear) {
    const filtered = transactions.filter(t => t.date.startsWith(selectedMonthYear));
    displayTransactions(filtered);
  } else {
    displayTransactions(transactions);
  }
}

