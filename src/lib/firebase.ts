import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBfeXt8GhvrQiGDMGdZI2wCG1cYJoNjUGo",
  authDomain: "jntuacek-c4cf8.firebaseapp.com",
  databaseURL: "https://jntuacek-c4cf8-default-rtdb.firebaseio.com",
  projectId: "jntuacek-c4cf8",
  storageBucket: "jntuacek-c4cf8.appspot.com",
  messagingSenderId: "426214539597",
  appId: "1:426214539597:web:b8413548fbe2f5f94bf704",
  measurementId: "G-J2PF9JJRQG"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
