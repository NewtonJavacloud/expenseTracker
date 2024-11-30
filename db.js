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
      amount: result.get('amount'),
      date: result.get('date'),
      comment: result.get('comment'),
    });
    displayTransactions();
  } catch (error) {
    alert("Error saving transaction: " + error.message);
  }
}

// Fetch transactions from Back4App
async function fetchTransactionsFromDB() {
  const Transaction = Parse.Object.extend('Transaction');
  const query = new Parse.Query(Transaction);

  try {
    const results = await query.equalTo('user', Parse.User.current()).find();
    transactions = results.map(transaction => ({
      id: transaction.id,
      amount: transaction.get('amount'),
      date: transaction.get('date'),
      comment: transaction.get('comment'),
    }));
    displayTransactions();
  } catch (error) {
    alert("Error fetching transactions: " + error.message);
  }
}