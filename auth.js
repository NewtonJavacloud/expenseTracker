// auth.js

// Handle Sign-Up Form Submission
async function signUpUser(name, pin) {
  const user = new Parse.User();
  user.set("username", name);
  user.set("password", pin);
  try {
    await user.signUp();
    alert("Sign-Up Successful! Please Login.");
    return true;
  } catch (error) {
    alert("Error during sign-up: " + error.message);
    return false;
  }
}

// Handle Login Form Submission
async function logInUser(name, pin) {
  try {
    await Parse.User.logIn(name, pin);
    return true;
  } catch (error) {
    alert("Login Failed: " + error.message);
    return false;
  }
}

// Handle Logout
async function logOutUser() {
  await Parse.User.logOut();
  console.log('User logged out');
}