# Vexel — gestão de veículos e relatórios

Aplicação full stack com **Angular e TypeScript**, **Node.js/Express** e **Firebase Auth/Firestore**. Reúne login, cadastro e consulta de veículos e relatórios da frota.

## Funcionalidades

- Login por e-mail e senha via Firebase Auth.
- Rotas Angular protegidas e validação de ID token na API.
- CRUD de veículos, com validação de dados no backend.
- Paginação e filtros por marca e status.
- Resumo da frota e indicadores de revisão.
- Simulação de consumo: os valores são ilustrativos, não medições reais.

## Arquitetura

1. Angular autentica o usuário no Firebase Auth.
2. O interceptor envia o ID token somente para a URL configurada da API.
3. Express valida o token com Firebase Admin e verifica revogação.
4. Os controllers consultam ou alteram a coleção `vehicles` no Firestore.
5. A API retorna os dados ao frontend.

O backend utiliza JavaScript; o frontend utiliza TypeScript. A autenticação é delegada ao Firebase, sem armazenamento de senhas pela API.

## Executar localmente

Use **Node.js 22.12 ou superior da linha 22**, npm e um projeto Firebase próprio. Configure Firestore e o provedor de login por e-mail/senha; crie um usuário de teste no Firebase Auth.

```sh
git clone https://github.com/lucaslusni/CBTDWEA---vexel.git
cd CBTDWEA---vexel/vexel/backend
npm install
```

Copie `.env.example` para `.env`. Configure `GOOGLE_APPLICATION_CREDENTIALS` com o caminho absoluto de uma credencial **nova**, armazenada fora do repositório. Ambientes com Application Default Credentials fornecidas pelo host podem omitir essa variável.

```sh
npm run dev
```

Em outro terminal, na pasta `vexel/frontend`:

```sh
npm install
npm start
```

Configure seu Firebase em `src/environments/environment.ts`, incluindo `apiUrl` (padrão local: http://localhost:3001). A interface abre em http://localhost:4200.

## Documentação

- [API, endpoints e configuração](vexel/backend/README.md)
- [Frontend](vexel/frontend/README.md)
- [Autenticação e tratamento de credenciais](docs/authentication.md)
- [Tratamento de credenciais anteriormente versionadas](SECURITY.md)

## Verificação

Na pasta `vexel/backend`, execute `npm test` para os testes do middleware, sem conexão ao Firebase.

Na pasta `vexel/frontend`, execute `node --experimental-strip-types --test test/api-url.test.mjs` para testar a restrição de destino do token, e `npm run build` para compilar o Angular.

## Limitações atuais

- Não há separação de acesso por proprietário ou papel: usuários autenticados compartilham a frota.
- Consultas e relatórios realizam parte da filtragem/agregação em memória.
- O cálculo de eficiência usa dados simulados.
- A instalação em produção exige configuração de credenciais, HTTPS e revisão das permissões do projeto Firebase.

O repositório não define uma licença de distribuição.

