// test-auth.js

// Importa a função para inicializar o app Firebase
import { initializeApp } from "firebase/app";

// Importa funções de autenticação: getAuth para pegar o objeto de auth
// e signInWithEmailAndPassword para fazer login com email e senha
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuração do Firebase do seu projeto
// ⚠️ Em projeto real, evite deixar isso público em repositórios sem necessidade
const firebaseConfig = {
    apiKey: "AIzaSyB2WuYZ9gc4wCQfWyzjMgp-YCn-K-1oJmo",
    authDomain: "vexel-api.firebaseapp.com",
    projectId: "vexel-api",
    storageBucket: "vexel-api.firebasestorage.app",
    messagingSenderId: "1037237354319",
    appId: "1:1037237354319:web:57502ab8a4f3110001cf3a",
};

// Inicializa o app Firebase com as configurações acima
const app = initializeApp(firebaseConfig);

// Pega a instância do serviço de autenticação (Auth) a partir do app
const auth = getAuth(app);

// 👇 Altere para um usuário real que exista no Firebase Authentication
// Esses dados são apenas para teste local
const email = "admin@empresa.com";
const password = "123456";

// Faz login com email e senha usando o Firebase Auth
signInWithEmailAndPassword(auth, email, password)
    // Se der certo, cai no .then()
    .then(async(userCred) => {
        // userCred contém informações do usuário autenticado
        // Aqui pegamos o ID Token JWT do usuário logado
        const token = await userCred.user.getIdToken();

        // Mostra o token no console bonitinho
        console.log("\n✅ Seu ID Token:\n");
        console.log(token);
    })
    // Se der erro (usuário não existe, senha errada, config errada...), cai aqui
    .catch(console.error);