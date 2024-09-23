import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApjfCQxJzfv8ziC7-UKbw9NISlf6-gFnA",
  authDomain: "curdmanage.firebaseapp.com",
  projectId: "curdmanage",
  storageBucket: "curdmanage.appspot.com",
  messagingSenderId: "725105456854",
  appId: "1:725105456854:web:f2df1d75ee0e387473bb77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);