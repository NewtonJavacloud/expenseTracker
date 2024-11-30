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