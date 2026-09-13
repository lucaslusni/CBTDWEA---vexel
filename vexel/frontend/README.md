# Vexel frontend

Interface Angular 20 com TypeScript para login, veículos e relatórios.

## Executar

Use Node.js 22.12 ou superior da linha 22.

```sh
npm install
npm start
```

Abra http://localhost:4200. A API deve estar em execução separadamente.

Edite `src/environments/environment.ts` com a configuração web do seu projeto Firebase e a URL absoluta da API. `app.config.ts` utiliza essa configuração centralizada.

## Autenticação

- `services/auth.service.ts`: login, logout e obtenção do ID token pelo SDK.
- `guards/auth.guard.ts`: proteção das páginas de veículos e relatórios.
- `auth-token.interceptor.ts`: envio do token à API.
- `api-url.ts`: comparação de origem e caminho para evitar o envio do token a outros destinos.

A configuração web Firebase é entregue ao navegador. Nunca inclua uma chave privada de conta de serviço nela.

## Compilar e verificar

```sh
npm run build
node --experimental-strip-types --test test/api-url.test.mjs
```

O teste de URL usa o executor nativo do Node.js. Os testes Angular existentes podem ser executados com `npm test` e precisam de um navegador compatível com o Karma configurado no projeto.

Leia o [fluxo de autenticação completo](../../docs/authentication.md).

