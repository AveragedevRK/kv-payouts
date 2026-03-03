import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdzhWSWp4XfyIrmqVJqabrEJ6rcY_3i94",
  authDomain: "payouts-51e73.firebaseapp.com",
  projectId: "payouts-51e73",
  storageBucket: "payouts-51e73.firebasestorage.app",
  messagingSenderId: "325007806682",
  appId: "1:325007806682:web:ac651f577798a83a4bd5e3",
  measurementId: "G-GPKQNFGQ3S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
