# ADR 0002: Uso de Docker para Containerização

## Status

Aceito

## Contexto

O projeto precisa ser facilmente portável, permitindo desenvolvimento local consistente e deploy simplificado. Além disso, é importante garantir que o ambiente de desenvolvimento seja idêntico ao de produção, evitando problemas de "funciona na minha máquina".

## Decisão

Decidimos containerizar apenas a aplicação frontend usando Docker, mantendo a simplicidade e portabilidade do projeto.

### Detalhes Técnicos

1. **Estrutura de Containers**
   - `frontend`: Aplicação Next.js com BFF

2. **Orquestração**
   - Docker para desenvolvimento e produção
   - Configuração via Dockerfile
   - Health checks configurados

3. **Ambientes**
   - Desenvolvimento: Frontend em container + Zitadel Cloud
   - Produção: Frontend em container + Zitadel Cloud

## Consequências

### Positivas

1. **Consistência**
   - Ambiente idêntico para todos os desenvolvedores
   - Sem problemas de "funciona na minha máquina"
   - Configuração padronizada

2. **Portabilidade**
   - Fácil de mover entre ambientes
   - Deploy simplificado
   - Isolamento de dependências

3. **Desenvolvimento**
   - Setup rápido com um comando
   - Fácil de limpar e recriar ambiente
   - Versões fixas de dependências

4. **Manutenção**
   - Documentação clara do ambiente
   - Fácil de atualizar versões
   - Processo de deploy padronizado

### Negativas

1. **Complexidade Adicional**
   - Mais arquivos de configuração
   - Necessidade de entender Docker
   - Curva de aprendizado inicial

2. **Recursos**
   - Maior consumo de memória
   - Mais espaço em disco
   - Overhead de containers

3. **Desenvolvimento**
   - Hot reload pode ser mais lento
   - Necessidade de reconstruir containers
   - Mais complexidade no debug

## Alternativas Consideradas

1. **Desenvolvimento Local Direto**
   - Prós: Mais simples, menos recursos
   - Contras: Inconsistência entre ambientes, problemas de portabilidade

2. **Vagrant**
   - Prós: Ambiente virtual completo
   - Contras: Mais pesado, menos moderno, mais complexo

3. **Kubernetes**
   - Prós: Mais robusto, melhor para produção
   - Contras: Complexidade excessiva para o escopo

## Justificativa da Escolha

A escolha do Docker foi baseada em:

1. **Simplicidade**
   - Setup com um comando
   - Documentação abundante
   - Comunidade ativa

2. **Portabilidade**
   - Funciona em qualquer sistema operacional
   - Fácil de mover entre ambientes
   - Padrão da indústria

3. **Desenvolvimento**
   - Ambiente isolado
   - Fácil de limpar e recriar
   - Versões fixas

4. **Produção**
   - Mesma configuração em todos os ambientes
   - Deploy simplificado
   - Escalabilidade facilitada

## Referências

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
