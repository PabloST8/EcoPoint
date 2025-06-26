// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2Dj-sh9WN46B7qhF5K7q0iV3QEga-8tc",
  authDomain: "ecopoint-c59d6.firebaseapp.com",
  projectId: "ecopoint-c59d6",
  storageBucket: "ecopoint-c59d6.firebasestorage.app",
  messagingSenderId: "45065806340",
  appId: "1:45065806340:web:5634ab16b87ce2ef500b51",
  measurementId: "G-4K79140K18",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
