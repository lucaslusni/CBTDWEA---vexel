// Importa os tipos necessários do módulo de SSR do Angular
// - RenderMode: define o modo de renderização (Server, Prerender, etc.)
// - ServerRoute: tipagem para as rotas usadas no servidor
import { RenderMode, ServerRoute } from '@angular/ssr';

// Define as rotas usadas especificamente no contexto de SSR
export const serverRoutes: ServerRoute[] = [
  {
    // '**' significa: casar qualquer rota (rota coringa / fallback)
    path: '**',
    // Define que todas essas rotas serão pré-renderizadas em build time
    // (gera HTML estático para essas URLs)
    renderMode: RenderMode.Prerender
  }
];
