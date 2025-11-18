# VEXEL Frontend (Angular)

Aplicação Angular com autenticação Firebase e comunicação com o backend Express.

## Como rodar
1) Instale dependências: `npm install`
2) Rode em dev: `npm start` (abre em `http://localhost:4200`)
3) Se precisar, ajuste a API em `src/environments/environment.ts` (`apiUrl`, padrão `http://localhost:3001`).

## Autenticação
- Login via Firebase Auth (email/senha) em `/login`.
- O `auth-token.interceptor.ts` injeta `Authorization: Bearer <ID token>` em todas as requisições HTTP.
- `auth.guard.ts` protege `/vehicles` e `/reports`, aguardando a reidratação do usuário antes de redirecionar.

## Rotas principais / navegação
- Navbar no topo (app root) com links para `Veículos` e `Relatórios` e botão de sair.
- `/login` — tela de login.
- `/vehicles` — CRUD de veículos; consome `/vehicles` do backend (listar, criar, atualizar, apagar).
- `/reports` — consome `/reports/summary` do backend e exibe métricas (total, ativos, médias).

## Services / chamadas à API
- `src/app/services/vehicles.service.ts`
  - `list({ page, pageSize, status, brand })` → GET `/vehicles` (retorna paginação: `{ items, count, page, pageSize }`; também aceita array se backend antigo).
  - `get(id)` → GET `/vehicles/:id`
  - `create(payload)` → POST `/vehicles`
  - `update(id, payload)` → PUT `/vehicles/:id`
  - `remove(id)` → DELETE `/vehicles/:id`
- `src/app/services/reports.service.ts`
  - `summary()` → GET `/reports/summary`

## Páginas e UI
- `vehicles` (`src/app/pages/vehicles/`): formulário de criação, edição inline na tabela, exclusão, paginação básica; tema verde futurista.
- `reports` (`src/app/pages/reports/`): cartões de métricas do resumo.
- `login` (`src/app/pages/login/`): tela de login com badge VEXEL.

## Estilo / tema
- Tema neon/verde nos `.scss` de cada página (gradientes, cards translúcidos, botões). Ajuste variáveis no topo dos `.scss` conforme o gosto.

## Dicas de debug
- DevTools (Network) para checar chamadas HTTP.
- 401/403: refaça login; backend exige Bearer.
- 404: confira `apiUrl` e paths.
- 500: veja log do backend.
