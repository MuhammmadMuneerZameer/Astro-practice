// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBugiyiIp_oUcdPSqZMHeuE8PN4WeGYUPE",
  authDomain: "hydrafoxdesigns.firebaseapp.com",
  projectId: "hydrafoxdesigns",
  storageBucket: "hydrafoxdesigns.firebasestorage.app",
  messagingSenderId: "609800352465",
  appId: "1:609800352465:web:dd0ed49e0b412db8d94bf0",
  measurementId: "G-1F1WXLXQKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };