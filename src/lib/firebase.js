import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAw4qNn2-UMbyN69mfld73MWErRiQKMiR8",
  authDomain: "fir-86b0b.firebaseapp.com",
  projectId: "fir-86b0b",
  storageBucket: "fir-86b0b.appspot.com",
  messagingSenderId: "824569409284",
  appId: "1:824569409284:web:206e2562d265b4d6bf6a51"
};

const firebase = Firebase.initializeApp(firebaseConfig);
const provider = new Firebase.auth.GoogleAuthProvider();
const db = Firebase.firestore();
const auth = Firebase.auth();

const storage = Firebase.storage();

export { firebase, provider, auth, db, storage };