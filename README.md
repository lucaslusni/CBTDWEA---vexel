🟢 VEXEL – Sistema de Gestão de Veículos e Relatórios

Frontend Angular + Backend Express + Firebase

O VEXEL é um sistema completo para gestão de veículos, autenticação de usuários e geração de relatórios.
O projeto é dividido em:

Frontend em Angular (tema neon futurista)

Backend em Node.js/Express

Firebase Auth + Firestore para autenticação e persistência

📌 Visão Geral da Arquitetura

O fluxo da aplicação funciona assim:

O usuário acessa o frontend Angular

Faz login via Firebase Auth

O Angular envia requisições para o Express (backend)

O backend valida o token no Firebase Admin

O backend busca e grava dados no Firestore

⚙ Requisitos do Projeto
Requisitos Globais

Node.js 18+

NPM 9+

Conta Firebase configurada

Git instalado

Navegador atualizado

Requisitos do Backend

Arquivo serviceAccountKey.json (não deve ser versionado)

Arquivo .env com:

PORT=3001

GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

Requisitos do Frontend

Angular CLI (opcional, mas recomendado)

🧩 FRONTEND – Angular
🚀 Como rodar o frontend

Instale as dependências
npm install

Inicie o servidor de desenvolvimento
npm start

Acesse o navegador em:
http://localhost:4200

Configure a URL da API em
src/environments/environment.ts
(campo apiUrl)

🔐 Autenticação

Autenticação via Firebase Auth (email/senha)

Login em /login

Interceptor adiciona automaticamente:
Authorization: Bearer <ID_TOKEN>

auth.guard.ts protege rotas privadas e aguarda reidratação do usuário

🧭 Rotas Principais

/login – Tela de login

/vehicles – CRUD de veículos

/reports – Dashboard de relatórios

📡 Serviços / Chamadas de API
VehiclesService

list()

get(id)

create(payload)

update(id, payload)

remove(id)

ReportsService

summary() – Obtém métrica geral de veículos e relatórios

🎨 UI / Tema

Tema neon/verdes futuristas

SCSS modular

Botões com efeito glow

Cards translúcidos

Variáveis no topo dos SCSS para customização rápida

🔥 BACKEND – Node.js / Express
🚀 Como rodar o backend

Instale dependências
npm install

Crie seu .env baseado no .env.example

PORT=3001

GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

Adicione sua chave Firebase (serviceAccountKey.json)

Execute em desenvolvimento
npm run dev

Execute em produção
npm start

API disponível em:
http://localhost:3001

🔐 Autenticação Firebase Admin

Todo acesso às rotas protegidas deve enviar:

Authorization: Bearer <ID_TOKEN>

O backend valida esse token via Firebase Admin SDK.

📚 Endpoints da API
Saúde

GET /health

Relatórios

GET /reports/public/summary (sem auth)

GET /reports/summary (com auth)

Veículos (todas exigem autenticação)

GET /vehicles (listagem com filtros e paginação)

GET /vehicles/:id

POST /vehicles

PUT /vehicles/:id

DELETE /vehicles/:id

GET /vehicles/check-up/all

GET /vehicles/efficiency/all

🗂 Estrutura do Backend

app.js – Configuração do Express

server.js – Inicialização do servidor

lib/firebase.js – Configuração Firebase Admin

middlewares/auth.js – Validação de token

routes/ – Rotas (vehicles e reports)

controllers/ – Regras de negócio

🔄 Integração Frontend ↔ Backend

O Angular envia requests ao backend via HttpClient

Interceptor injeta o Bearer Token automaticamente

Backend valida no Firebase

Firestore guarda e retorna dados

🛠 Dicas de Debug
Frontend

Use DevTools > Network para ver requisições

401/403: refazer login

404: revisar apiUrl

500: erro no backend

Backend

Conferir logs do terminal

Verificar configuração de .env

Validar chave Firebase

🧼 Boas Práticas de Versionamento

Nunca versionar:

node_modules

.env

serviceAccountKey.json

dist/ ou build/

arquivos de log

Use um .gitignore adequado.

📄 Licença

Define conforme necessidade do projeto.
