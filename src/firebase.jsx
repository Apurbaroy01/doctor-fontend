// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcpBixCKiGlz6HeEdrMFAjTir6lKOM-24",
  authDomain: "doctor-69b09.firebaseapp.com",
  projectId: "doctor-69b09",
  storageBucket: "doctor-69b09.firebasestorage.app",
  messagingSenderId: "234966034513",
  appId: "1:234966034513:web:85c69f4e2465b93cdb7070"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;