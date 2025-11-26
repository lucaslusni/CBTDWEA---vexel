// Importa o Router do Express para criar um agrupamento de rotas modular
import { Router } from "express";

// Importa as funções (handlers) do controller de veículos
import {
    list,
    getById,
    create,
    update,
    remove,
    checkUp,
    efficiency
} from "../controllers/vehicles.controller.js";

// Importa o middleware de autenticação, que garante que só usuários logados acessem as rotas protegidas
import { authRequired } from "../middlewares/auth.js";

// Cria uma instância de roteador específica para veículos
const router = Router();

// ===================================================================
// Rotas públicas de teste (descomentando, ficam acessíveis sem login)
// ===================================================================

// Exemplo de rota pública que retornaria informações de check-up de veículos
// router.get("/public/check-up", checkUp);

// Exemplo de rota pública que retornaria informações de eficiência de veículos
// router.get("/public/efficiency", efficiency);

// ===================================================================
// A partir daqui, todas as rotas exigem autenticação
// ===================================================================

// Aplica o middleware de autenticação em todas as rotas abaixo.
// Qualquer requisição depois desse .use() precisa passar pelo authRequired.
router.use(authRequired);

// ===================================================================
// Rotas específicas (relatórios / análises)
// ===================================================================

// Retorna check-up de todos os veículos (por exemplo, revisões pendentes, manutenção, etc.)
router.get("/check-up/all", checkUp);

// Retorna dados de eficiência de todos os veículos (ex: consumo, km rodados, etc.)
router.get("/efficiency/all", efficiency);

// ===================================================================
// Rotas genéricas de CRUD de veículos
// ===================================================================

// Lista todos os veículos (com possíveis filtros/paginação no controller)
router.get("/", list);

// Busca um veículo específico pelo ID
router.get("/:id", getById);

// Cria um novo veículo (dados vêm no body da requisição)
router.post("/", create);

// Atualiza os dados de um veículo existente pelo ID
router.put("/:id", update);

// Remove (deleta) um veículo pelo ID
router.delete("/:id", remove);

// Exporta o roteador para ser usado em app.js (app.use("/vehicles", router))
export default router;