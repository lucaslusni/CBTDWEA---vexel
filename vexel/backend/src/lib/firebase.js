import admin from "firebase-admin";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve credencial via env (string JSON ou caminho) com fallback para o arquivo local.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPath = path.resolve(__dirname, "../../serviceAccountKey.json");
const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : defaultPath;

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Permite definir a credencial como JSON string/base64 em ambiente de deploy.
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  const decoded = Buffer.from(raw, "base64").toString("utf8");
  serviceAccount = JSON.parse(decoded || raw);
} else if (existsSync(credsPath)) {
  serviceAccount = JSON.parse(readFileSync(credsPath, "utf8"));
} else {
  throw new Error(
    `Nenhuma credencial Firebase encontrada. Defina FIREBASE_SERVICE_ACCOUNT ou coloque o arquivo em ${credsPath}`
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
  });
}

export const db = admin.firestore();
export const authAdmin = admin.auth();
