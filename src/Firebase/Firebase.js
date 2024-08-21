import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Jaizm database credintials hello

const firebaseConfig = {
  apiKey: "AIzaSyAbAKpPuSYcUzeKauH4_hvh4R1ezRWKmVQ",
  authDomain: "account-bc9d2.firebaseapp.com",
  projectId: "account-bc9d2",
  storageBucket: "account-bc9d2.appspot.com",
  messagingSenderId: "141202899686",
  appId: "1:141202899686:web:c16fe23797f7ee60597127",
  measurementId: "G-8BGDZ01FGW"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
