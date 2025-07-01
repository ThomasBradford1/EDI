// firebaseConfig.js (Modular SDK version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArVwEwK1N2KBDwpbwMYhhK0TeWbLh1KA0",
  authDomain: "ediwouldgo-s03.firebaseapp.com",
  projectId: "ediwouldgo-s03",
  storageBucket: "ediwouldgo-s03.appspot.com",
  messagingSenderId: "661344646265",
  appId: "661344646265",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
