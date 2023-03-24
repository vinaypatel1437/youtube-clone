// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import {collection, getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO8YnRPu35rbEnXzRNppsz51tbVRC5ec4",
  authDomain: "video-app-1ada8.firebaseapp.com",
  projectId: "video-app-1ada8",
  storageBucket: "video-app-1ada8.appspot.com",
  messagingSenderId: "709770760542",
  appId: "1:709770760542:web:7624cef1734b02861e3fcf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const database = {
  videos: collection(firestore, 'videos'),
  users: collection(firestore, 'users'),
}
