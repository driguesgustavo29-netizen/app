import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBS3F8lYsk-GkAjUmR6Z035Pt2aq_a7PDw",
  authDomain: "projeto-alunos-6a525.firebaseapp.com",
  projectId: "projeto-alunos-6a525",
  storageBucket: "projeto-alunos-6a525.firebasestorage.app",
  messagingSenderId: "1055112746645",
  appId: "1:1055112746645:web:532c2db8c8783c936b2d9c",
  measurementId: "G-8L4H1WJX02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);