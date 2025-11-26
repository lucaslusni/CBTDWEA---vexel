import 'zone.js/node'; // Importa a implementação de Zone.js para ambiente Node (necessário para SSR do Angular)

import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Função de bootstrap usada pelo Angular Universal/SSR
// O `context` traz informações do lado do servidor (request, etc.) caso você precise.
const bootstrap = (context: BootstrapContext) =>
  // Inicializa a aplicação Angular no modo server-side, usando o App como root component
  // e as configurações específicas para SSR definidas em `app.config.server.ts`.
  bootstrapApplication(App, config, context);

// Exporta a função como padrão para ser usada pelo runtime de SSR
export default bootstrap;
