import "dotenv/config";
import admin from "firebase-admin";

// Uses Application Default Credentials: an external key path supplied through
// GOOGLE_APPLICATION_CREDENTIALS, or credentials provided by the host.
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

export const db = admin.firestore();
export const authAdmin = admin.auth();

