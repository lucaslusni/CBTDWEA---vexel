// test-auth.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB2WuYZ9gc4wCQfWyzjMgp-YCn-K-1oJmo",
    authDomain: "vexel-api.firebaseapp.com",
    projectId: "vexel-api",
    storageBucket: "vexel-api.firebasestorage.app",
    messagingSenderId: "1037237354319",
    appId: "1:1037237354319:web:57502ab8a4f3110001cf3a",
};

// inicializa app e auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 👇 altere com um usuário que você tenha criado no Firebase Authentication
const email = "admin@empresa.com";
const password = "123456";

signInWithEmailAndPassword(auth, email, password)
    .then(async(userCred) => {
        const token = await userCred.user.getIdToken();
        console.log("\n✅ Seu ID Token:\n");
        console.log(token);
    })
    .catch(console.error);