// ================================================
// FIREBASE CONFIGURAÇÃO
// ARYANA & RAUL FILIPE
// ================================================

import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyClv1nNqkkhBxYnwCg9xfkv6O6vq6el6Rs",

    authDomain:
        "casamento-aryana-raul-filipe.firebaseapp.com",


    projectId:
        "casamento-aryana-raul-filipe",

    storageBucket:
        "casamento-aryana-raul-filipe.firebasestorage.app",

    messagingSenderId:
        "964273800716",

    appId:
        "1:964273800716:web:70907e6a3ead92b4b95029"

};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


export { app, db };