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
    toggleContainers('login');
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
    toggleContainers('expense');
    await fetchTransactionsFromDB();
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async function () {
  await Parse.User.logOut();
  toggleContainers('login');
});

// Toggle containers between login, signup, and expense
function toggleContainers(view) {
  const loginContainer = document.getElementById('login-container');
  const signupContainer = document.getElementById('signup-container');
  const expenseContainer = document.getElementById('expense-container');

  if (view === 'login') {
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
    expenseContainer.style.display = 'none';
  } else if (view === 'signup') {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
    expenseContainer.style.display = 'none';
  } else if (view === 'expense') {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'none';
    expenseContainer.style.display = 'block';
  }
}