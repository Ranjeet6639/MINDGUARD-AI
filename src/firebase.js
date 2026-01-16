import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2HxcSIeQ11uaTb5dwkei9ZvAhB_wtuaw",
  authDomain: "mindguard-ai-58ad8.firebaseapp.com",
  projectId: "mindguard-ai-58ad8",
  storageBucket: "mindguard-ai-58ad8.appspot.com",
  messagingSenderId: "1093373904214",
  appId: "1:1093373904214:web:82c8d99aa31f8abeae42f7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
