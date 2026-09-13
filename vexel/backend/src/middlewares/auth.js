import { authAdmin } from "../lib/firebase.js";
import { createAuthRequired } from "./auth-token.js";

export const authRequired = createAuthRequired(
  (token, checkRevoked) => authAdmin.verifyIdToken(token, checkRevoked)
);

