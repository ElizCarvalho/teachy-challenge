# Documentação da API Teachy

Este projeto utiliza Swagger/OpenAPI para documentar suas APIs de forma interativa.

## Como acessar a documentação Swagger

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

2. Acesse a URL:
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Recursos disponíveis

A documentação interativa permite:

- Visualizar todos os endpoints disponíveis
- Ver parâmetros esperados, corpos de requisição e respostas
- Testar endpoints diretamente pela interface
- Explorar modelos de dados (schemas)

## Atualizando a documentação

A especificação OpenAPI está definida em `/docs/api/openapi.json`. Para atualizar a documentação:

1. Edite o arquivo JSON com as novas rotas, parâmetros ou modelos
2. Reinicie o servidor (se necessário)
3. Acesse a página de documentação para ver as alterações

## Para Desenvolvedores

Quando desenvolver novas APIs, certifique-se de:

1. Atualizar a especificação OpenAPI para incluir seus novos endpoints
2. Manter as descrições claras e precisas
3. Incluir exemplos de uso sempre que possível
4. Documentar todos os possíveis códigos de status e mensagens de erro
