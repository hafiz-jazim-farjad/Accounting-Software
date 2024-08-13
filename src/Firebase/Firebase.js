import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Hassan database credintials 

// const firebaseConfig = {
//   apiKey: "AIzaSyBt3RPQaKDUQ6iWcAjTeyvEMONgUkVh0dA",
//   authDomain: "accountingsoftware-fa9ab.firebaseapp.com",
//   projectId: "accountingsoftware-fa9ab",
//   storageBucket: "accountingsoftware-fa9ab.appspot.com",
//   messagingSenderId: "1388068342",  
//   appId: "1:1388068342:web:a22f20b1e88d73a0d15bd7",
//   measurementId: "G-PGRYQ81Y1B"
// };


// Jaizm database credintials 

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
