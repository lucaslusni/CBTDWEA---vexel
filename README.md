# VEXEL – Sistema de Gestão de Veículos e Relatórios

O VEXEL é um sistema composto por frontend em Angular, backend em Node.js/Express e integração com Firebase (Auth e Firestore).  
Ele oferece gestão de veículos, geração de relatórios, autenticação segura e interface moderna.

---

## Arquitetura Geral

Fluxo geral da aplicação:

1. O usuário acessa o frontend Angular.  
2. Realiza login via Firebase Auth (email e senha).  
3. O Angular envia requisições ao backend Express.  
4. O backend valida o token com Firebase Admin.  
5. Os dados são consultados/gravados no Firestore.  
6. O frontend exibe as informações para o usuário.

---

# Frontend (Angular)

## Requisitos

- Node.js 18+  
- NPM atualizado  
- Angular CLI (opcional)  
- Conta Firebase configurada

---

## Configuração

1. Instale dependências  
   `npm install`

2. Execute em desenvolvimento  
   `npm start`

3. Acesse  
   `http://localhost:4200`

4. Configure a URL da API em  
   `src/

3. Adicione o arquivo `serviceAccountKey.json` na raiz do backend.

4. Execute em desenvolvimento  
`npm run dev`

5. Execute em produção  
`npm start`

API disponível em:  
`http://localhost:3001`

---

## Autenticação

As rotas protegidas exigem o header:

`Authorization: Bearer <ID_TOKEN>`

A validação é feita via Firebase Admin SDK.

---

## Endpoints

### Relatórios
- GET /reports/public/summary  
- GET /reports/summary  

### Veículos
- GET /vehicles  
- GET /vehicles/:id  
- POST /vehicles  
- PUT /vehicles/:id  
- DELETE /vehicles/:id  
- GET /vehicles/check-up/all  
- GET /vehicles/efficiency/all  

### Healthcheck
- GET /health

---

## Estrutura do Backend

- src/app.js – configuração do Express  
- src/server.js – inicialização  
- src/lib/firebase.js – integração Firebase Admin  
- src/middlewares/auth.js – validação de token  
- src/routes – rotas  
- src/controllers – regras de negócio  

---

# Integração Frontend ↔ Backend

- Angular utiliza HttpClient para consumir a API  
- O token é inserido automaticamente  
- O backend valida o token  
- O Firestore retorna os dados  
- O frontend atualiza a visualização  

---

# Dicas de Debug

## Frontend
- 401/403: token inválido  
- 404: URL incorreta no environment  
- 500: erro interno do backend  
- Verificar a aba Network no DevTools  

## Backend
- Conferir logs no terminal  
- Verificar `.env`  
- Verificar chave Firebase  
- Conferir permissões do Firestore  

---

# Boas Práticas

Não versionar:

- node_modules  
- .env  
- serviceAccountKey.json  
- dist/ ou build/  

Utilizar .gitignore apropriado.

---

# Licença

Defina conforme necessidade do projeto.
