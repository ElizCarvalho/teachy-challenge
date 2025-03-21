# ADR 0001: Uso do Zitadel como Identity Provider

## Status

Aceito

## Contexto

O desafio técnico requer a implementação de um sistema robusto de autenticação e gerenciamento de sessões com as seguintes características principais:

- Autenticação via Google (OAuth 2.0)
- Autenticação de dois fatores (2FA)
- Gerenciamento de sessões múltiplas
- Sistema de permissões por escola
- Segurança robusta
- Escalabilidade

O prazo para implementação é de 3 dias, o que requer uma abordagem pragmática e eficiente.

## Decisão

Decidimos utilizar o Zitadel Cloud como Identity Provider (IdP) para o sistema, implementando a solução através de uma arquitetura BFF (Backend for Frontend) com Next.js.

### Detalhes Técnicos

1. **Arquitetura**
   - Next.js com App Router
   - Zitadel Cloud como IdP central
   - BFF para comunicação segura
   - TypeScript para type safety

2. **Componentes Principais**
   - Autenticação OAuth2/OIDC
   - Gerenciamento de sessões
   - Sistema de permissões
   - 2FA nativo

3. **Fluxo de Autenticação**
   - Frontend → BFF → Zitadel Cloud
   - Tokens gerenciados no servidor
   - Sessões monitoradas via Zitadel

4. **Ambientes**
   - Desenvolvimento: Zitadel Cloud (plano gratuito)
   - Produção: Zitadel Cloud (plano pago após 10.000 usuários)

## Consequências

### Positivas

1. **Velocidade de Desenvolvimento**
   - Redução significativa do tempo de implementação
   - Foco na lógica de negócio
   - Menos código para manter
   - Setup rápido e simples

2. **Segurança**
   - Solução auditada e testada
   - Proteção contra vulnerabilidades comuns
   - Conformidade com padrões de segurança
   - Atualizações automáticas de segurança

3. **Escalabilidade**
   - Arquitetura preparada para crescimento
   - Suporte a múltiplas organizações
   - Performance otimizada
   - Escalabilidade automática

4. **Manutenibilidade**
   - Código mais limpo e organizado
   - Menos complexidade
   - Documentação robusta
   - Suporte técnico disponível

### Negativas

1. **Dependência de Terceiros**
   - Reliance no Zitadel Cloud
   - Possível custo em produção (após 10.000 usuários)
   - Curva de aprendizado inicial

2. **Complexidade de Configuração**
   - Setup inicial mais complexo
   - Necessidade de entender conceitos de OIDC
   - Configuração de ambiente mais elaborada

3. **Limitações de Customização**
   - Algumas funcionalidades podem ser limitadas
   - Necessidade de adaptar requisitos à solução
   - Menos controle sobre detalhes específicos

## Alternativas Consideradas

1. **Desenvolvimento Próprio**
   - Prós: Controle total, customização completa
   - Contras: Tempo excessivo, complexidade alta, riscos de segurança

2. **Auth0**
   - Prós: Solução madura, boa documentação
   - Contras: Custo mais alto, complexidade de licenciamento

3. **Keycloak**
   - Prós: Open source, funcionalidades completas
   - Contras: Mais pesado, configuração complexa, necessidade de infraestrutura própria

## Justificativa da Escolha

A escolha do Zitadel Cloud foi baseada em:

1. **Prazo do Desafio**
   - Implementação rápida
   - Menos código para desenvolver
   - Foco no valor do negócio
   - Setup simplificado

2. **Requisitos Técnicos**
   - Atende todos os requisitos do desafio
   - Solução moderna e atualizada
   - Boa integração com Next.js
   - Recursos completos disponíveis

3. **Qualidade e Segurança**
   - Solução auditada
   - Boas práticas de segurança
   - Performance comprovada
   - Atualizações automáticas

4. **Escalabilidade**
   - Preparado para crescimento
   - Suporte a múltiplas organizações
   - Arquitetura moderna
   - Escalabilidade automática

5. **Custos e Recursos**
   - Plano gratuito com 10.000 usuários ativos
   - Recursos completos disponíveis
   - Sem necessidade de infraestrutura própria
   - Modelo de preços transparente

## Referências

- [Documentação do Zitadel](https://zitadel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OAuth 2.0 e OIDC](https://oauth.net/2/)
