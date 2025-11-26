// Importa a aplicação Express configurada no arquivo app.js
// (lá dentro você deve ter algo como: const app = express(); export default app;)
import app from "./app.js";

// Define a porta em que o servidor vai rodar.
// Primeiro tenta usar a variável de ambiente PORT (útil em produção, como no Render, Railway, etc).
// Se não existir, usa a porta 3001 como padrão.
const PORT = process.env.PORT || 3001;

// Inicia o servidor HTTP usando o app do Express, escutando na porta definida.
// Quando o servidor subir com sucesso, executa a função de callback e mostra uma mensagem no console.
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});