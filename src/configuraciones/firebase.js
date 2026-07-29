import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC9-mrPWinowa3CYRQvX66usm9jl8TVm7s",
    authDomain: "curriculo-15cab.firebaseapp.com",
    databaseURL: "https://curriculo-15cab-default-rtdb.firebaseio.com",
    projectId: "curriculo-15cab",
    storageBucket: "curriculo-15cab.firebasestorage.app",
    messagingSenderId: "450152203335",
    appId: "1:450152203335:web:7ae50d620be355bad29d62",
    measurementId: "G-T6F9QZ74WK"
};

const app=initializeApp(firebaseConfig);
export const db=getDatabase(app);
export const auth=getAuth(app);