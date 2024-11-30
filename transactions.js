// transactions.js

// Function to display transactions
function displayTransactions(transactions) {
  const transactionContainer = document.getElementById('transaction-container');
  transactionContainer.innerHTML = '';

  const groupedTransactions = groupTransactionsByMonthYear(transactions);

  Object.keys(groupedTransactions)
    .sort((a, b) => b.localeCompare(a))
    .forEach(monthYear => {
      const label = document.createElement('h3');
      const [year, month] = monthYear.split('-');
      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
      label.textContent = `${monthName} ${year} - Total: ₹${groupedTransactions[monthYear].total.toFixed(2)}`;
      transactionContainer.appendChild(label);

      const table = document.createElement('table');
      table.classList.add('transaction-table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Amount (₹)</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${groupedTransactions[monthYear].transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => {
              const date = new Date(transaction.date);
              if (!isValidDate(date)) return ''; // Skip invalid dates
              const formattedDate = date.toLocaleDateString('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric'
              });
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true
              });
              const amount = parseFloat(transaction.amount).toFixed(2);
              return `
                <tr>
                  <td>${formattedDate} ${formattedTime}</td>
                  <td>₹${amount}</td>
                  <td>${transaction.comment || 'No comment'}</td>
                  <td>
                    <button onclick="deleteTransaction('${transaction.id}')" class="delete-btn">Delete</button>
                  </td>
                </tr>`;
            }).join('')}
        </tbody>
      `;
      transactionContainer.appendChild(table);
    });
}

// Function to group transactions by month and year
function groupTransactionsByMonthYear(transactions) {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    if (!isValidDate(date)) return acc; // Skip invalid dates
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
    const monthYear = `${year}-${month}`;
    if (!acc[monthYear]) acc[monthYear] = { total: 0, transactions: [] };
    acc[monthYear].total += parseFloat(transaction.amount);
    acc[monthYear].transactions.push(transaction);
    return acc;
  }, {});
}

// Helper function to check if a date is valid
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}