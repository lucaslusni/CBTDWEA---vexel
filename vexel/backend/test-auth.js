import "dotenv/config";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const apiKey = process.env.TEST_FIREBASE_API_KEY;
const email = process.env.TEST_AUTH_EMAIL;
const password = process.env.TEST_AUTH_PASSWORD;

if (!apiKey || !email || !password) {
  console.error("Configure TEST_FIREBASE_API_KEY, TEST_AUTH_EMAIL e TEST_AUTH_PASSWORD no .env local.");
  process.exitCode = 1;
} else {
  const app = initializeApp({ apiKey });
  const auth = getAuth(app);
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // Local helper only: stdout contains a bearer credential. Do not share it.
    console.log(await credential.user.getIdToken());
  } catch {
    console.error("Nao foi possivel autenticar. Confira a configuracao e o usuario de teste.");
    process.exitCode = 1;
  } finally {
    await signOut(auth).catch(() => {});
    await deleteApp(app);
  }
}

