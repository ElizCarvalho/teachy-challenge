# Desafio Teachy SWE

## Instruções Gerais

1. *Clone* este repositório
2. Em seu *fork*, desenvolva sua solução
3. Notifique sua entrega para prosseguirmos.

## Desafio Técnico

Desenvolvimento de Sistema de Autenticação e Gerenciamento de Sessões para a Plataforma Teachy

O objetivo deste desafio é implementar um sistema robusto de autenticação e gerenciamento de sessões com permissões para a plataforma educacional Teachy, que deve servir múltiplas plataformas e permitir login via Google e 2FA (autenticação de dois fatores). O sistema deve ser capaz de gerenciar usuários pertencentes a múltiplas escolas, com diferentes permissões para cada usuário.

O sistema de autenticação deve garantir segurança, escalabilidade e flexibilidade, proporcionando uma experiência de login suave e segura para os usuários. Além disso, deve ser possível monitorar sessões ativas e permitir que administradores gerenciem usuários de forma eficiente.

## Requisitos Técnicos

### Autenticação e Integração com Google

- O sistema de autenticação deve permitir login usando uma conta Google (OAuth 2.0).
- O login do Google deve ser configurado para garantir que informações essenciais do usuário (nome, email) sejam armazenadas com segurança no banco de dados.
- O usuário deve ser capaz de vincular sua conta Google a outras contas escolares (uma ou mais).
  
### Autenticação de Dois Fatores (2FA)
  
- O sistema deve fornecer a opção de autenticação de dois fatores (2FA), onde o usuário pode receber um código via SMS ou aplicativo de autenticação (como Google Authenticator).
- 2FA será obrigatório para usuários com acesso a contas escolares ou para administradores.
- O sistema deve permitir armazenamento e verificação segura do código 2FA.
  
### Gerenciamento de Sessões
  
- O sistema deve gerenciar sessões ativas de login para cada usuário, permitindo que eles façam login em múltiplos dispositivos simultaneamente.
- O administrador deve ser capaz de visualizar informações sobre as sessões ativas de um usuário, como número de dispositivos conectados e duração da sessão.
- O administrador deve ser capaz de desconectar um usuário de todos os dispositivos simultaneamente ou de um dispositivo específico.

### Estrutura de Permissões e Usuários
  
- Usuários Escolares: Usuários podem pertencer a uma ou mais escolas e terão diferentes permissões dependendo da escola a que pertencem (ex: aluno, professor, coordenador).
- Conta Administrativa: Usuários administradores terão permissões para gerenciar usuários, visualizar sessões e controlar permissões escolares. Eles também podem remover usuários imediatamente da plataforma.
- O sistema deve garantir que um usuário possa ter múltiplas contas vinculadas (ex: uma conta pessoal e várias contas escolares).
- A plataforma deve permitir gerenciamento dinâmico de permissões, permitindo que administradores ajustem permissões de usuários individualmente ou por grupo.
  
### Banco de Dados
  
- O banco de dados deve ser projetado para armazenar as informações necessárias para gerenciar autenticação (Postgres/Redis).
- Cada usuário deve ter:
  - Informações de perfil (nome, email, etc.).
  - Informações de autenticação (credenciais Google, 2FA).
  - Informações de permissões.
  - Lista de contas vinculadas (ex: conta pessoal e múltiplas contas escolares).
  - O banco de dados deve garantir que a relação entre usuários e dispositivos de sessão seja mantida de forma eficiente.
  
### Segurança
  
- O sistema deve implementar medidas de segurança apropriadas para proteger dados de usuários, incluindo criptografia de senhas (ex: bcrypt), hash de códigos 2FA e proteção contra ataques CSRF/XSS.
- JWT (JSON Web Tokens) deve ser usado para gerenciar sessões de usuários de forma segura.
  
### Implementação Frontend (Next.js)
  
- O desafio deve incluir uma aplicação frontend básica usando Next.js para demonstrar a integração do sistema de autenticação.
- A aplicação frontend deve ter rotas protegidas, acessíveis apenas por usuários autenticados.
- Rotas protegidas devem verificar a autenticidade do usuário e seu nível de permissão antes de conceder acesso.
- A interface do usuário deve fornecer uma opção para login com Google e autenticação 2FA.
- O sistema de gerenciamento de sessões (visualização e desconexão de dispositivos) deve ser acessível aos administradores através de uma interface simples.
  
## Requisitos Mínimos de Implementação

### Backend

- Implementar a API de autenticação com OAuth 2.0 para Google e o sistema 2FA.
- Criar endpoints para gerenciamento de sessões e dispositivos.
- Implementar gerenciamento de permissões de usuários para usuários escolares e administradores.
  
### Frontend (Next.js)

- Página de login com autenticação Google.
- Página de autenticação de dois fatores (para usuários com 2FA ativado).
- Rotas protegidas que requerem autenticação para acessar certos conteúdos.
- Página de gerenciamento de sessões (para administradores).
  
### Base de Dados

- Modelar as entidades de usuário, escola, sessão e dispositivo.
- Implementar persistência de dados para usuários, contas, permissões e sessões.
  
## Critérios de Avaliação

- Funcionalidade: A solução deve atender todos os requisitos de autenticação, gerenciamento de sessões, permissões de usuários e segurança.
- Escalabilidade: O sistema deve ser projetado para escalar, com possibilidade de integração futura com outras plataformas.
- Segurança: A implementação deve ser segura, usando as melhores práticas de criptografia e proteção de dados sensíveis.
- Usabilidade: A interface de administração e os fluxos de login devem ser intuitivos e fáceis de usar.
- Qualidade do Código: O código deve ser limpo, modular, bem estruturado e documentado.
