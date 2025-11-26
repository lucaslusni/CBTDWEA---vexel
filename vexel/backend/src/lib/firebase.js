import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(new URL("../../serviceAccountKey.json", import.meta.url))
);

// Inicializa admin SDK apenas uma vez, usando service account local
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export const db = admin.firestore(); // acesso ao Firestore
export const authAdmin = admin.auth(); // verificação de tokens do Firebase Auth
