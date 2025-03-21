# Sistema de Autenticação e Gerenciamento de Sessões Teachy

Este documento descreve a implementação do sistema de autenticação e gerenciamento de sessões para a plataforma educacional Teachy.

## Visão Geral

O sistema foi implementado utilizando as seguintes tecnologias:

- **Next.js** como framework principal
- **Zitadel** como Identity Provider (IdP)
- **OAuth 2.0 / OpenID Connect** para autenticação
- **Cookies HTTP-only** para gerenciamento de sessões
- **Tailwind CSS** para estilização

## Arquitetura do Sistema

### 1. Fluxo de Autenticação

```text
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│  Cliente  │<───>│  Next.js  │<───>│  Zitadel  │
│           │     │           │     │           │
└───────────┘     └───────────┘     └───────────┘
```

1. O usuário acessa a aplicação e clica em "Login"
2. É redirecionado para o Zitadel para autenticação
3. Após autenticação bem-sucedida, retorna com um código de autorização
4. O backend do Next.js troca o código por tokens (access, ID, refresh)
5. Os tokens são armazenados em cookies HTTP-only
6. O usuário é redirecionado para o dashboard

### 2. Gerenciamento de Sessões

- Cookies HTTP-only são usados para armazenar tokens de forma segura
- O sistema implementa refresh token automático
- Administradores podem visualizar e encerrar sessões de usuários
- Verificações de token são realizadas a cada requisição protegida

### 3. Sistema de Permissões

- Cada usuário tem uma função (role) definida
- Funções disponíveis: `admin`, `teacher`, `student`
- O middleware verifica permissões para acessar rotas protegidas
- Administradores têm acesso ao painel de administração

### 4. Autenticação de Dois Fatores (2FA)

- Implementado via configuração do Zitadel
- Suporta TOTP (Google Authenticator, Authy)
- Suporta autenticadores FIDO2 (WebAuthn)
- Pode ser configurado como obrigatório para todos ou apenas administradores

## Componentes Principais

### API Routes

- `/api/auth/callback` - Processa o callback de autenticação OAuth
- `/api/auth/check-session` - Verifica e atualiza tokens de sessão
- `/api/auth/logout` - Encerra a sessão ativa
- `/api/admin/sessions` - Gerencia sessões de usuários (admin only)

### Componentes React

- `AuthProvider` - Gerencia o estado de autenticação
- `Navbar` - Barra de navegação com informações do usuário
- `Notification` - Sistema de notificações na interface

### Páginas

- `/login` - Página de login
- `/dashboard` - Dashboard do usuário
- `/admin` - Painel de administração
- `/auth/callback` - Página de processamento de callback

## Configuração do Sistema

### Variáveis de Ambiente

```text
# Zitadel Configuration
NEXT_PUBLIC_ZITADEL_URL=https://[seu-instance].zitadel.cloud
NEXT_PUBLIC_ZITADEL_CLIENT_ID=[seu-client-id]
NEXT_PUBLIC_ZITADEL_PROJECT_ID=[seu-project-id]
ZITADEL_CLIENT_SECRET=[seu-client-secret]

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configuração do Zitadel

1. **Criação do Projeto**:
   - Crie um projeto no console do Zitadel
   - Configure um aplicativo web com redirecionamento para `/auth/callback`

2. **Configuração de Token**:
   - Ative "User Info inside ID Token"
   - Ative "User roles inside ID Token"

3. **Configuração de 2FA**:
   - Ative "Force MFA for local authenticated users"
   - Configure os métodos de 2FA preferidos

## Segurança

### Medidas Implementadas

1. **Tokens Seguros**:
   - Tokens armazenados apenas em cookies HTTP-only
   - Não acessíveis via JavaScript no frontend

2. **Proteção contra Ataques**:
   - CSRF: Uso de tokens específicos para formulários
   - XSS: Sanitização de entrada e CSP
   - Session Hijacking: Cookies seguros + HttpOnly

3. **Permissões Granulares**:
   - Middleware verifica permissões em cada rota protegida
   - Validação no servidor para toda ação administrativa

## Considerações de Escalabilidade

- O sistema utiliza Zitadel Cloud, que escala automaticamente
- A arquitetura stateless facilita escalabilidade horizontal
- Sessões são validadas via IdP, não armazenadas localmente
- O design permite adicionar mais provedores de identidade no futuro

## Testes

Para testar o sistema:

1. **Autenticação Básica**:
   - Acesse `/login` e use o botão "Entrar com Google"
   - Verifique redirecionamento para o dashboard

2. **Verificação de 2FA**:
   - Configure o 2FA no console do Zitadel
   - Teste o fluxo de login com verificação adicional

3. **Gerenciamento de Sessões**:
   - Faça login em vários dispositivos
   - Acesse o painel admin para visualizar e encerrar sessões

## Conclusão

O sistema de autenticação implementado atende a todos os requisitos do desafio técnico, fornecendo uma solução robusta, segura e escalável para a plataforma Teachy.
