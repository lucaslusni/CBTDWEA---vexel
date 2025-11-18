import { authAdmin } from "../lib/firebase.js";

export async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Token nao fornecido" });

  try {
    req.user = await authAdmin.verifyIdToken(token);
    next();
  } catch (err) {
    console.error("Auth Firebase:", err);
    res.status(401).json({ message: "Token invalido ou expirado" });
  }
}
