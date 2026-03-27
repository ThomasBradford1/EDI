import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const loginBtn = document.getElementById("login-btn");
const loginContainer = document.getElementById("login-container");
const submitLoginBtn = document.getElementById("submit-login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

// Show login form when clicking login button
loginBtn.addEventListener("click", () => {
  loginContainer.style.display = loginContainer.style.display === "none" ? "block" : "none";
});

// Handle login submission
submitLoginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // Simplified admin detection
    if (password === "Admin1") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "admin.html"; // redirect admin
    } else {
      alert("You are not an admin.");
      loginContainer.style.display = "none"; // hide form
    }

  } catch (err) {
    loginError.textContent = err.message;
  }
});

// Optional: Logout functionality if you add logout button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("isAdmin");
    window.location.href = "leaderboard.html"; // return to leaderboard
  });
}