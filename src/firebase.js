import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAgwJLpIuQSr1pWudzc8SkwCR2Of_P6tiA",
    authDomain: "react-321b2.firebaseapp.com",
    projectId: "react-321b2",
    storageBucket: "react-321b2.appspot.com",
    messagingSenderId: "490810637390",
    appId: "1:490810637390:web:93200b5e79292551c9d71f"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage }
