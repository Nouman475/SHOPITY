// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBw7Xx863zf_32iOAxBupvgRQ1hm6TSPWY",
    authDomain: "react-firebase-7.firebaseapp.com",
    projectId: "react-firebase-7",
    storageBucket: "react-firebase-7.appspot.com",
    messagingSenderId: "86073070240",
    appId: "1:86073070240:web:2415066211c4cbbf1defc5",
    measurementId: "G-5R806H5J7W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, auth }