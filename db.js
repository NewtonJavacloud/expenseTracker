// dbConnection.js

// Initialize Parse
Parse.initialize("IYLHZnugAnW5yNuoGEva7KQ8aQXF8agoGatm0dPG", "CKTZ1KhUFx7EG4bpDgunsP45R2rNnrRMaJ9zGXGo");
Parse.serverURL = 'https://parseapi.back4app.com';

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
    console.log('Transaction saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    throw error;
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
    return results.map(transaction => ({
      id: transaction.id,
      amount: transaction.get('amount'),
      date: transaction.get('date').toISOString().split('T')[0],
      comment: transaction.get('comment'),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

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
    throw error;
  }
}