import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// DOM references
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const userEmailSpan = document.getElementById("user-email");

const adminPanel = document.getElementById("admin-panel");
const userPanel = document.getElementById("user-panel");
const loginError = document.getElementById("login-error");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    userEmailSpan.textContent = user.email;

    // Simplified role detection based on password
    if (password === "Admin1") {
     // Redirect admins to admin.html
  window.location.href = 'admin.html';
} else if (password === 'Password') {
  // Redirect users to leaderboard.html
  window.location.href = 'leaderboard.html';
} else {
  alert('Invalid password');
}

  } catch (err) {
    loginError.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  loginContainer.style.display = "block";
  appContainer.style.display = "none";
  emailInput.value = "";
  passwordInput.value = "";
  loginError.textContent = "";
});
