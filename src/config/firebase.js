// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRu_2RTWw19ut2MhAKFJ8ha8G4D9QFkrI",
  authDomain: "react-food-app-703d1.firebaseapp.com",
  projectId: "react-food-app-703d1",
  storageBucket: "react-food-app-703d1.appspot.com",
  messagingSenderId: "857479023864",
  appId: "1:857479023864:web:d731069df53556db00ff0d",
  measurementId: "G-MBLSZRRTVF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { analytics, auth, firestore };
