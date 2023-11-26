import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Add this line for Firestore
import 'firebase/compat/storage'; // Add this line for Storage

const firebaseConfig = {
  apiKey: 'AIzaSyD5dRlIgjIuqptPZgf63j71yKTtc1n-NQs',
  authDomain: 'file-sharing-71380.firebaseapp.com',
  projectId: 'file-sharing-71380',
  storageBucket: 'file-sharing-71380.appspot.com',
  messagingSenderId: '117439452814',
  appId: '1:117439452814:web:133a13478eee50066d9bdf',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore(); // Export Firestore
export const storage = firebase.storage(); // Export Storage
export const fire= firebase;
