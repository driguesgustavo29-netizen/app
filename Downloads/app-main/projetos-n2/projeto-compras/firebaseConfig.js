import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1SzOWkJzK6vNCj2W_aJExjCqZmBU7Kq8",
  authDomain: "projeto-compras-8557c.firebaseapp.com",
  projectId: "projeto-compras-8557c",
  storageBucket: "projeto-compras-8557c.firebasestorage.app",
  messagingSenderId: "947917718066",
  appId: "1:947917718066:web:b9d135ff69933dca9bb22b",
  measurementId: "G-4PGQCGQ7F3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
