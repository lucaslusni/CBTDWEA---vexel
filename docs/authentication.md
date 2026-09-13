# Autenticação do Vexel

## Componentes e fluxo

| Componente | Responsabilidade |
| --- | --- |
| Angular / AuthService | Envia e-mail e senha ao Firebase Auth, faz logout e solicita ID tokens |
| Firebase Auth | Autentica o usuário e administra os tokens da sessão pelo SDK |
| authGuard | Controla acesso às páginas Angular |
| authTokenInterceptor | Anexa Bearer somente às URLs da API configurada |
| Express / authRequired | Valida o ID token, incluindo revogação, e define req.user |
| Firebase Admin / Firestore | Executa operações de dados usando credenciais do servidor |

O guard é uma proteção de navegação. A decisão de acesso aos dados é feita novamente no backend, independentemente do navegador.

## Credenciais do usuário

`signInWithEmailAndPassword` entrega as credenciais ao Firebase Auth. A API Express não recebe a senha nesse fluxo.

O código não define uma política própria de persistência do Firebase Auth. A persistência de sessão fica sob responsabilidade do SDK e do ambiente. O serviço não mantém um cache adicional de ID token: aguarda a inicialização do estado e solicita `currentUser.getIdToken()` a cada requisição autenticada.

O SDK cuida da obtenção/renovação do token. A aplicação não manipula diretamente refresh tokens. O logout chama `signOut`; ele encerra a sessão local, mas não equivale a revogar todas as sessões de uma conta.

## Tokens nas requisições

O interceptor compara protocolo, host, porta e prefixo de caminho da URL com `environment.apiUrl`. Somente URLs absolutas dessa API recebem o token. As requisições a outros destinos seguem sem o cabeçalho acrescentado pelo interceptor.

O servidor aceita `Authorization: Bearer <ID_TOKEN>`. A verificação usa `verifyIdToken(token, true)`, incluindo a consulta de revogação. Essa consulta acrescenta comunicação com o Firebase e requer as permissões correspondentes na conta de serviço.

Tokens ausentes, malformados ou rejeitados retornam 401 sem detalhes sensíveis. Não há renovação/repetição automática após uma resposta 401 no interceptor.

## Credenciais do servidor

Firebase Admin usa Application Default Credentials. Em desenvolvimento, `GOOGLE_APPLICATION_CREDENTIALS` pode apontar para uma chave nova, armazenada fora do repositório. O `.env` local é ignorado pelo Git.

A configuração web do Firebase identifica o projeto no frontend; ela não é a chave privada administrativa. Chaves de conta de serviço nunca devem ser enviadas ao navegador.

## Autenticação e autorização

As rotas de veículos e de resumo exigem usuário autenticado. O projeto ainda não distingue papéis ou propriedade dos registros: não há isolamento de frota por usuário.

O acesso pelo Admin SDK requer que a autorização da aplicação seja aplicada no servidor. Não considere regras do cliente como substituto para esse controle.

A rota pública de resumo foi retirada; `/health` continua público.

## Credenciais antigas

A remoção dos arquivos da versão atual não revoga chaves, não troca senhas e não apaga o histórico. Siga [SECURITY.md](../SECURITY.md) para tratar a exposição anterior.

