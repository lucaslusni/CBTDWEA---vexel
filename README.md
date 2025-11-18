🟢 VEXEL – Sistema de Gestão de Veículos e Relatórios
Frontend (Angular) + Backend (Node.js/Express) + Firebase (Auth & Firestore)

Este repositório contém o sistema VEXEL, uma aplicação completa para gestão de veículos, exibição de relatórios, controle de acesso via Firebase e comunicação entre um backend Express e um frontend Angular com autenticação integrada.

📌 Sumário

Visão Geral

Arquitetura Geral

Requisitos

Frontend (Angular)

Como rodar o frontend

Autenticação

Rotas principais

Serviços / API

UI / Tema

Backend (Node.js / Express)

Como rodar o backend

Autenticação Firebase

Endpoints

Estrutura de pastas

Integração Front ↔ Back

Dicas de Debug

Boas práticas de versionamento

Licença

🟩 Visão Geral

O VEXEL é um sistema completo composto por:

✔ Frontend em Angular – Interface moderna com tema neon/verde, autenticação e navegação protegida.
✔ Backend em Node.js/Express – Rotas, lógica de negócio e integração com Firebase Admin (Auth + Firestore).
✔ Firebase – Autenticação de usuários e banco de dados Firestore para veículos e relatórios.

O objetivo do sistema é oferecer:

CRUD completo de veículos

Métricas e relatórios de uso

Autenticação segura via Firebase

Comunicação via REST API

🏗️ Arquitetura Geral
[ Angular (Frontend) ]  →  [ Express API ]  →  [ Firebase Admin + Firestore ]
        |                         |                         |
    Usuário Web           Regras de Negócio         Autenticação & Dados

🧩 Requisitos
Requisitos Globais

Node.js 18+

NPM 9+

Conta Firebase (Auth + Firestore)

Navegador atualizado

Git para versionamento

Requisitos Backend

Arquivo serviceAccountKey.json (não versionado!)

Arquivo .env com:

PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

Requisitos Frontend

Angular CLI (recomendado):

npm install -g @angular/cli

🖥️ Frontend (Angular)
🚀 Como rodar o frontend

Instale as dependências:

npm install


Rode em modo desenvolvimento:

npm start


Aplicação ficará disponível em:

http://localhost:4200


Configure a URL da API em:

src/environments/environment.ts


Exemplo:

apiUrl: "http://localhost:3001"

🔐 Autenticação

O frontend utiliza Firebase Auth (email/senha).

Rota de login: /login

Token JWT é obtido via Firebase

Interceptor:

auth-token.interceptor.ts

injeta automaticamente:

Authorization: Bearer <ID_TOKEN>

Proteção de rotas

auth.guard.ts protege rotas como:

/vehicles

/reports

O guard aguarda a reidratação do usuário via Firebase antes de liberar o acesso.

🧭 Rotas principais
Rota	Descrição
/login	Tela de login
/vehicles	CRUD de veículos (lista, cria, edita, remove)
/reports	Dashboard com métricas resumidas
📡 Serviços / API
vehicles.service.ts

list({ page, pageSize, status, brand })

get(id)

create(payload)

update(id, payload)

remove(id)

reports.service.ts

summary() – retorna métricas de uso dos veículos.

🎨 UI / Tema

Tema neon verde futurista, com:

gradientes

cartões translúcidos

botões estilizados

SCSS modular por página

Variáveis do tema podem ser ajustadas diretamente no topo dos .scss.

🔥 Backend (Node.js / Express)
🚀 Como rodar o backend

Instalar dependências:

npm install


Criar .env baseado em .env.example:

PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json


Adicionar chave privada do Firebase:

Firebase Console → Configurações do Projeto
→ Contas de Serviço
→ Gerar nova chave privada

Rodar em desenvolvimento:

npm run dev


Produção:

npm start


API padrão:

http://localhost:3001

🔐 Autenticação Firebase Admin

O backend valida o header:

Authorization: Bearer <ID_TOKEN>


O auth.js usa Firebase Admin para verificar tokens e liberar acesso restrito.

📚 Endpoints da API
▶ Health

GET /health
Verifica se o servidor está ativo.

▶ Relatórios
Sem autenticação (teste)

GET /reports/public/summary

Com autenticação

GET /reports/summary
Retorna:

total de veículos

ativos

médias

min/max de anos

cálculo automático de eficiência

▶ Veículos (todas exigem Auth)
Listar (com paginação)
GET /vehicles?page=1&pageSize=10&status=active&brand=Ford

Criar
POST /vehicles
{
  "plate": "ABC1D23",
  "model": "Onix",
  "brand": "Chevrolet",
  "year": 2020,
  "status": "active",
  "mileage": 35120
}

Atualizar
PUT /vehicles/:id

Remover
DELETE /vehicles/:id

Check-up
GET /vehicles/check-up/all

Eficiência
GET /vehicles/efficiency/all

🗂️ Estrutura do Backend
src/
 ├─ app.js               # Bootstrap Express
 ├─ server.js            # Inicia servidor
 ├─ lib/firebase.js      # Config Firebase Admin
 ├─ middlewares/
 │   └─ auth.js          # Validação de tokens
 ├─ routes/
 │   ├─ vehicles.routes.js
 │   └─ reports.routes.js
 ├─ controllers/
 │   ├─ vehicles.controller.js
 │   └─ reports.controller.js
 └─ ...

🔄 Integração Front ↔ Back

O Angular chama o backend usando HttpClient.

Todas as chamadas recebem automaticamente o token JWT via interceptor.

O backend valida tudo com Firebase Admin.

O Firestore é usado como base de dados principal.

🛠️ Dicas de Debug
Frontend

DevTools → Network para checar requests

401/403 → refazer login

404 → conferir apiUrl

500 → backend quebrando

Backend

Logs do console

Verificar .env e serviceAccountKey.json

Checar erros do Firebase Admin

🚫 Boas práticas de versionamento

NUNCA versionar:

node_modules

.env

serviceAccountKey.json

arquivos de build (dist, out, build)

Use um .gitignore adequado (posso gerar um pra você se quiser).

📄 Licença

Projeto interno. Define a licença conforme sua necessidade.
