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
