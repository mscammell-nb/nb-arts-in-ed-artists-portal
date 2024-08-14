import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Add security rules in firebase to make sure that putting this here is safe.
const firebaseConfig = {
  apiKey: "AIzaSyBafzz7QZ7Da9Ke-6gXunyTQmCftBa5IMk",
  authDomain: "musical-instruments-5bd86.firebaseapp.com",
  projectId: "musical-instruments-5bd86",
  storageBucket: "musical-instruments-5bd86.appspot.com",
  messagingSenderId: "22040299814",
  appId: "1:22040299814:web:b083b43194d41f1386d9e7",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth };
