# Credenciais anteriormente versionadas

Uma versão anterior do repositório incluiu uma chave privada de conta de serviço e credenciais literais em um script de teste. Esta alteração remove esses valores da versão proposta, mas **não revoga a chave, não troca a senha e não reescreve o histórico**.

## Ações na conta responsável

1. Identifique a chave de conta de serviço exposta no Google Cloud/Firebase e revogue-a. Caso a aplicação dependa dela, configure uma credencial substituta fora do repositório.
2. Troque a senha do usuário utilizado pelo antigo script de teste e encerre/revogue suas sessões pelo mecanismo administrativo aplicável.
3. Revise atividade, permissões e recursos acessíveis pela conta de serviço.
4. Depois da revogação, avalie a limpeza do histórico com os colaboradores. Clones e cópias anteriores podem continuar contendo os arquivos.

Essas ações administrativas não são executadas pelo código deste pull request.

## Configuração daqui em diante

- Use Application Default Credentials ou uma chave externa indicada por `GOOGLE_APPLICATION_CREDENTIALS`.
- Use `.env.example` apenas como modelo, sem valores secretos.
- Não versione `.env`, chaves privadas ou tokens.
- Use uma conta de teste para `test-auth.js` e não compartilhe sua saída.

