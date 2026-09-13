# Vexel API

API Node.js/Express para gestão de veículos e relatórios, com Firebase Admin e Firestore.

## Configuração

1. Use Node.js 22.12 ou superior da linha 22 e execute `npm install`.
2. Copie `.env.example` para `.env`.
3. Configure `PORT` (padrão 3001).
4. Configure `GOOGLE_APPLICATION_CREDENTIALS` com o caminho absoluto para uma nova chave de conta de serviço fora do repositório, ou utilize credenciais fornecidas pelo ambiente.
5. Execute `npm run dev` ou `npm start`.

O módulo Firebase carrega o `.env` e usa `applicationDefault()`; nenhuma chave privada deve estar no código ou nesta pasta.

## Endpoints

| Método e caminho | Acesso | Função |
| --- | --- | --- |
| `GET /health` | Público | Estado HTTP da aplicação; não testa o Firestore |
| `GET /reports/summary` | Autenticado | Resumo da frota |
| `GET /vehicles` | Autenticado | Lista com `page`, `pageSize`, `status` e `brand` |
| `GET /vehicles/:id` | Autenticado | Consulta por identificador |
| `POST /vehicles` | Autenticado | Cadastro |
| `PUT /vehicles/:id` | Autenticado | Atualização parcial, sem alterar a placa |
| `DELETE /vehicles/:id` | Autenticado | Exclusão |
| `GET /vehicles/check-up/all` | Autenticado | Indicadores de revisão |
| `GET /vehicles/efficiency/all` | Autenticado | Simulação de consumo |

A antiga rota `/reports/public/summary` foi removida. Use `/reports/summary` com autenticação.

Exemplo de cadastro:

```json
{
  "plate": "ABC1D23",
  "model": "Onix",
  "brand": "Chevrolet",
  "year": 2020,
  "status": "active",
  "mileage": 35120
}
```

## Autenticação

Envie `Authorization: Bearer <ID_TOKEN>`. O middleware valida o token e verifica revogação usando Firebase Admin. Falhas retornam 401.

Para obter um token localmente, configure `TEST_FIREBASE_API_KEY`, `TEST_AUTH_EMAIL` e `TEST_AUTH_PASSWORD` no `.env` e execute `node test-auth.js`. Use um usuário de teste do seu próprio projeto. O script imprime um ID token no terminal; não compartilhe essa saída nem a armazene no Git.

## Testes

```sh
npm test
```

Os testes do middleware usam um verificador injetado e não acessam Firebase. Eles verificam cabeçalhos ausentes ou malformados, identidade validada, solicitação de checagem de revogação e rejeição de erros. A integração real depende de um projeto Firebase configurado.

## Estrutura

- `src/app.js`: Express e montagem das rotas.
- `src/lib/firebase.js`: credenciais do ambiente e serviços Firebase.
- `src/middlewares/auth.js`: integração do middleware com Firebase.
- `src/middlewares/auth-token.js`: validação do cabeçalho e tratamento de falhas.
- `src/routes/`: endpoints.
- `src/controllers/`: operações e relatórios.
- `src/models/`: representação dos veículos.

Leia também [autenticação](../../docs/authentication.md) e [credenciais expostas](../../SECURITY.md).

