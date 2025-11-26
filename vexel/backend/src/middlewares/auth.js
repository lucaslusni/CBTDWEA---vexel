// Importa o objeto authAdmin configurado no Firebase Admin SDK,
// que será usado para validar o token JWT enviado pelo frontend.
import { authAdmin } from "../lib/firebase.js";

// Middleware de autenticação que garante que apenas usuários com
// token válido (emitido pelo Firebase Auth) acessem as rotas protegidas
export async function authRequired(req, res, next) {
    // Lê o cabeçalho Authorization da requisição (ex: "Bearer <token>")
    const authHeader = req.headers.authorization || "";

    // Se começar com "Bearer ", remove essa parte e pega só o token.
    // Caso contrário, token fica como null.
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    // Se não tiver token, já retorna 401 (não autorizado)
    if (!token) return res.status(401).json({ message: "Token nao fornecido" });

    try {
        // Verifica o token usando o Firebase Admin.
        // Se for válido, retorna os dados do usuário (uid, email, etc).
        req.user = await authAdmin.verifyIdToken(token); // valida token emitido pelo Firebase Auth

        // Se deu tudo certo, chama o próximo middleware ou controller
        next();
    } catch (err) {
        // Se a verificação falhar (token inválido, expirado, etc),
        // loga o erro e retorna 401.
        console.error("Auth Firebase:", err);
        res.status(401).json({ message: "Token invalido ou expirado" });
    }
}