# ADR 0003: Implementação de 2FA com Zitadel

## Status

Aceito

## Contexto

O desafio técnico requer a implementação de autenticação de dois fatores (2FA) obrigatória para usuários com acesso a contas escolares ou para administradores. A implementação deve permitir o uso de códigos via SMS ou aplicativo de autenticação.

## Decisão

Decidimos utilizar a funcionalidade nativa de 2FA do Zitadel Cloud para implementar este requisito, delegando a complexidade de gerenciamento de 2FA ao provedor de identidade.

### Detalhes Técnicos

1. **Fluxo de 2FA**
   - Ativação obrigatória de 2FA para usuários administradores e escolares via Zitadel
   - Suporte para aplicativos de autenticação (TOTP)
   - Configuração centralizada no console do Zitadel

2. **Implementação**
   - Integração com fluxo de autenticação do Zitadel
   - Redirecionamento para tela de 2FA quando necessário
   - Validação de códigos feita pelo Zitadel

3. **UX de 2FA**
   - Tela de configuração para primeira vez
   - Suporte para múltiplos métodos (TOTP, backup codes)
   - Mensagens de erro claras

## Consequências

### Positivas

1. **Segurança**
   - Implementação robusta e testada
   - Gerenciamento seguro de segredos 2FA
   - Auditoria de eventos de 2FA
   - Proteção contra ataques comuns

2. **Desenvolvimento**
   - Rápida implementação
   - Menos código para manter
   - Solução testada e confiável
   - Delegação da complexidade

3. **Experiência do Usuário**
   - Interface consistente de autenticação
   - Opções flexíveis de 2FA
   - Procedimentos padrão da indústria

### Negativas

1. **Dependência**
   - Vinculação à implementação do Zitadel
   - Limitado às opções oferecidas
   - Customização visual limitada

2. **Opções**
   - Suporte a SMS pode requerer integração adicional
   - Alguns recursos avançados podem requerer plano pago

## Alternativas Consideradas

1. **Implementação Própria de 2FA**
   - Prós: Controle total, customização completa
   - Contras: Tempo excessivo, complexidade alta, riscos de segurança

2. **Uso de Biblioteca Específica (como Speakeasy)**
   - Prós: Mais controle, integração direta
   - Contras: Mais desenvolvimento, testes necessários, complexidade adicional

## Justificativa da Escolha

A escolha da implementação de 2FA via Zitadel foi baseada em:

1. **Prazo do Desafio**
   - Implementação rápida
   - Solução pronta e testada
   - Foco no valor do negócio

2. **Segurança**
   - Implementação validada
   - Conformidade com padrões
   - Gerenciamento seguro

3. **Manutenibilidade**
   - Menos código próprio
   - Atualizações automáticas
   - Delegação de complexidade

4. **Integração**
   - Coerência com a decisão do IdP
   - Fluxo consistente para o usuário
   - Gerenciamento centralizado

## Referências

- [Documentação de 2FA do Zitadel](https://zitadel.com/docs/guides/manage/console/user-factors)
- [RFC 6238 - TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
