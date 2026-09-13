// The verifier is injected so rejection paths can be tested without Firebase.
export function createAuthRequired(verifyIdToken) {
  return async function authRequired(req, res, next) {
    const header = req.headers.authorization;
    const match = typeof header === "string"
      ? /^Bearer ([^\s]+)$/i.exec(header)
      : null;

    if (!match) {
      return res.status(401).json({ message: "Token nao fornecido ou malformado" });
    }

    try {
      // Check revocation as well as signature/expiry.
      req.user = await verifyIdToken(match[1], true);
    } catch {
      // Do not log credentials or the submitted token.
      return res.status(401).json({ message: "Token invalido ou expirado" });
    }

    return next();
  };
}

