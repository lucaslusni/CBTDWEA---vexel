# Vexel API (backend)

API em Node.js/Express integrada ao Firebase (Firestore e Auth) para gestao de veiculos e relatorios.

## Requisitos
- Node 18+ e npm
- Conta Firebase com chave de service account para Firestore/Auth

## Configuracao
1) Instale dependencias:
```
npm install
```

2) Crie o arquivo `.env` (baseado no `.env.example`):
```
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

3) Adicione a chave do Firebase:
   - Gere uma chave JSON em Firebase Console -> Configuracoes do projeto -> Contas de servico -> Gerar nova chave privada.
   - Salve como `serviceAccountKey.json` na raiz do backend (mesmo caminho apontado em `GOOGLE_APPLICATION_CREDENTIALS`).
   - Nao versione este arquivo ou o `.env`.

## Execucao
- Desenvolvimento (hot reload):
```
npm run dev
```
- Producao/local simples:
```
npm start
```
O servidor sobe por padrao em `http://localhost:3001` (ajustavel via `PORT`).

## Autenticacao
- Rotas protegidas exigem header `Authorization: Bearer <ID_TOKEN>` validado pelo Firebase Auth.
- Para obter um ID token de teste, edite `test-auth.js` com um usuario criado no Firebase Auth e execute:
```
node test-auth.js
```

## Endpoints
- `GET /health` – checagem publica.

**Relatorios**
- `GET /reports/public/summary` – resumo sem auth (para teste rapido).
- `GET /reports/summary` – resumo com auth. Retorna totais, medias e anos min/max.

**Veiculos** (todas exigem auth)
- `GET /vehicles` – lista paginada (`page`, `pageSize`, filtro `status`, `brand`).
- `GET /vehicles/:id` – detalhe por ID (padrao usa a placa como ID).
- `POST /vehicles` – cria veiculo. Body esperado:
```json
{ "plate": "ABC1D23", "model": "Onix", "brand": "Chevrolet", "year": 2020, "status": "active", "mileage": 35120 }
```
- `PUT /vehicles/:id` – atualiza campos (exceto placa); aceita payload parcial.
- `DELETE /vehicles/:id` – remove veiculo.
- `GET /vehicles/check-up/all` – lista veiculos que precisam de revisao (mileage > 10.000 ou idade >= 1 ano).
- `GET /vehicles/efficiency/all` – simula consumo medio e alerta de baixo consumo.

## Estrutura
- `src/app.js` – bootstrap Express, healthcheck e rotas.
- `src/server.js` – inicializa servidor HTTP.
- `src/lib/firebase.js` – configuracao Firebase Admin (Firestore/Auth).
- `src/middlewares/auth.js` – valida ID token (Bearer).
- `src/routes/*.routes.js` – definicao das rotas.
- `src/controllers/*.controller.js` – regras de negocio e acesso ao Firestore.

## Observacoes
- O Firestore usa a collection `vehicles` (ID default = placa). Alguns endpoints fazem ordenacao/filtragem em memoria; para grandes volumes, considere indexes/queries.
- Ha artefatos de ambiente (`node_modules`, `serviceAccountKey.json`, `.env`) que nao deveriam ser versionados; mantenha-os fora do controle de versao em futuros commits.
