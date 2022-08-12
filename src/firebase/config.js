import firebase from 'firebase/app';

import "firebase/auth";
import "firebase/firestore";
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAGLjXBu39SJGsrU8jPa4mr26VNQ8KTqNY",
  authDomain: "smart-restaurant-9641e.firebaseapp.com",
  projectId: "smart-restaurant-9641e",
  storageBucket: "smart-restaurant-9641e.appspot.com",
  messagingSenderId: "567267360509",
  appId: "1:567267360509:web:f0bf5b024e0419c42d4894",
  measurementId: "G-R3BMRCQGKE",
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
fire.analytics();

const auth = fire.auth();
const store = fire.firestore();

export { auth, store };
