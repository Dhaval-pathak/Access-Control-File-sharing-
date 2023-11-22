import firebase from 'firebase/compat/app'; // Note the change here
import 'firebase/compat/auth'; // Import the auth module separately if needed


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
export default firebase;
