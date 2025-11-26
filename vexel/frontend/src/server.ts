import 'zone.js/node'; // Importa o Zone.js para ambiente Node (necessário para SSR do Angular)

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Caminho da pasta de build do frontend (versão browser gerada pelo Angular)
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express(); // Cria instância do servidor Express
const angularApp = new AngularNodeAppEngine(); // Engine que sabe renderizar a app Angular no servidor

/**
 * Aqui é o lugar para definir endpoints REST da sua API dentro do mesmo servidor Express (se você quiser).
 * Por padrão está só como exemplo/comentado.
 *
 * Exemplo:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Tratar requisição de API
 * });
 * ```
 */

/**
 * Serve arquivos estáticos gerados no build (HTML, JS, CSS, imagens, etc) a partir da pasta /browser.
 * - maxAge: '1y' -> permite cache de até 1 ano no cliente/CDN
 * - index: false -> não serve automaticamente index.html
 * - redirect: false -> não faz redirecionamento automático
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Para qualquer outra rota que não foi atendida pelos estáticos/endpoints acima,
 * o Express delega para o Angular fazer a renderização server-side (SSR).
 */
app.use((req, res, next) => {
  angularApp
    .handle(req) // AngularNodeAppEngine processa a requisição
    .then((response) =>
      // Se o Angular devolveu uma resposta SSR, escreve ela na response do Node;
      // senão, chama next() para outros middlewares/rotas
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next); // Em caso de erro, passa para o handler de erro padrão do Express
});

/**
 * Sobe o servidor Express se:
 * - este módulo for o módulo principal (executado diretamente), OU
 * - estiver sendo executado via PM2 (process manager)
 *
 * Usa a porta definida na env `PORT`, ou 4000 como padrão.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Exporta um request handler pronto para ser usado:
 * - pelo Angular CLI (dev-server, build)
 * - ou por plataformas como Firebase Cloud Functions / Cloud Run, etc.
 */
export const reqHandler = createNodeRequestHandler(app);
