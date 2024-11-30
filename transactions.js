// transactions.js

// Display transactions grouped by month/year
function displayTransactions(transactions) {
  const transactionContainer = document.getElementById('transaction-container');
  transactionContainer.innerHTML = '';

  const groupedTransactions = groupTransactionsByMonthYear(transactions);

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