import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjpyEdirC4bED1nuCZYF-_Mv7xENffcA0",
  authDomain: "codora-501.firebaseapp.com",
  projectId: "codora-501",
  storageBucket: "codora-501.firebasestorage.app",
  messagingSenderId: "184944189754",
  appId: "1:184944189754:web:690a628ce17fc5abca7003",
  measurementId: "G-FTXCMCG21Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
