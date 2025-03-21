# Guia de Configuração do Zitadel

Este documento fornece instruções detalhadas para configurar o Zitadel para uso com a aplicação Teachy.

## Configuração Inicial

### 1. Criar Projeto no Zitadel

1. Faça login no console do Zitadel
2. Navegue até "Projects" e clique em "New Project"
3. Nomeie o projeto "Teachy Authentication"
4. Copie o Project ID para o arquivo `.env`

### 2. Configurar Aplicação Web

1. No projeto criado, vá para "Applications"
2. Clique em "New Application" e selecione "Web"
3. Configure:
   - Nome: "Teachy Web App"
   - RedirectURIs: `http://localhost:3000/auth/callback`
   - PostLogoutURIs: `http://localhost:3000`
   - Response Types: "Code"
   - Grant Types: "Authorization Code" e "Refresh Token"
   - Auth Method: "Basic"
4. Copie o Client ID e Client Secret para o arquivo `.env`

### 3. Configuração de Tokens

1. Na aplicação criada, navegue até "Token Settings"
2. Ative "User Info inside ID Token"
3. Ative "User roles inside ID Token"
4. Defina um ClockSkew adequado (2-3 segundos)

## Configuração de MFA/2FA

1. No menu principal, vá para "Security" > "Authentication"
2. Na seção "Multifactor Authentication", ative:
   - "Force MFA for local authenticated users only"
   - "One Time Password by Authenticator App (TOTP)"
   - "Fingerprint, Security Keys, Face ID and other"
3. Configure os tempos de validade de verificação MFA conforme necessário

## Integração com Google

1. No menu principal, vá para "Actions" > "Identity Providers"
2. Clique em "+ Add Provider" e selecione "Google"
3. Configure com as credenciais do Google Cloud Console
4. Ative "Auto Create User" para criação automática de usuários
