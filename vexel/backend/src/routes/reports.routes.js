// Importa o Router do Express para criar um agrupamento de rotas
import { Router } from "express";

// Importa a função summary do controller de relatórios
// Ela provavelmente monta um resumo/agregado dos dados (veículos, uso, etc.)
import { summary } from "../controllers/reports.controller.js";

// Importa o middleware que garante que apenas usuários autenticados
// possam acessar determinadas rotas
import { authRequired } from "../middlewares/auth.js";

// Cria uma instância de roteador exclusiva para as rotas de relatórios
const router = Router();

// ===================================================================
// Rota pública (sem autenticação) — útil para testes rápidos
// ===================================================================

// GET /reports/public/summary
// Retorna um resumo dos dados sem exigir login
// (bom para testar se o backend está respondendo corretamente)
router.get("/public/summary", summary);

// ===================================================================
// Rotas protegidas (exigem autenticação)
// ===================================================================

// Aplica o middleware de autenticação em todas as rotas abaixo.
// A partir daqui, qualquer requisição precisa estar autenticada.
router.use(authRequired);

// GET /reports/summary
// Mesma lógica da rota pública, mas agora protegida:
// apenas usuários autenticados podem acessar esse resumo.
router.get("/summary", summary);

// Exporta o roteador para ser utilizado em app.js,
// geralmente com algo como: app.use("/reports", router);
export default router;