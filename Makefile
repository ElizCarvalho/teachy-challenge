.PHONY: setup dev build prod test lint clean logs shell restart help

# Docker image name and container name for consistent references
IMAGE_NAME = teachy-saas
CONTAINER_NAME = teachy-saas-container

# Setup development environment
setup:
	@echo "Instalando dependências..."
	npm install

# Start development server
dev:
	@echo "Iniciando servidor de desenvolvimento..."
	npm run dev

# Build Docker image with option for no-cache
build:
	@echo "Construindo imagem Docker..."
	docker build -t $(IMAGE_NAME) .

# Build with no cache (useful when dependencies change)
build-no-cache:
	@echo "Construindo imagem Docker sem cache..."
	docker build --no-cache -t $(IMAGE_NAME) .

# Run production server with consistent container name
prod: stop
	@echo "Iniciando servidor em modo produção..."
	docker run -d --name $(CONTAINER_NAME) -p 3000:3000 --env-file .env $(IMAGE_NAME)
	@echo "Servidor rodando em http://localhost:3000"

# Stop running container
stop:
	@echo "Parando container se estiver rodando..."
	docker stop $(CONTAINER_NAME) 2>/dev/null || true
	docker rm $(CONTAINER_NAME) 2>/dev/null || true

# Restart container
restart: stop prod

# Run tests
test:
	@echo "Executando testes..."
	npm run test

# Run linter
lint:
	@echo "Executando linter..."
	npm run lint

# View logs of running container
logs:
	@echo "Exibindo logs do container..."
	docker logs -f $(CONTAINER_NAME)

# Open shell in running container
shell:
	@echo "Abrindo shell no container..."
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Clean environment
clean: stop
	@echo "Removendo imagem Docker..."
	docker rmi $(IMAGE_NAME) 2>/dev/null || true
	@echo "Removendo volumes não utilizados..."
	docker volume prune -f
	@echo "Removendo redes não utilizadas..."
	docker network prune -f
	@echo "Limpando cache do sistema..."
	docker system prune -f

# Help command
help:
	@echo "Teachy SaaS - Sistema para gestão escolar"
	@echo ""
	@echo "Comandos disponíveis:"
	@echo "  make setup         - Instala as dependências do projeto"
	@echo "  make dev           - Inicia o servidor de desenvolvimento"
	@echo "  make build         - Constrói a imagem Docker"
	@echo "  make build-no-cache - Constrói a imagem Docker sem usar cache"
	@echo "  make prod          - Inicia o container em modo produção"
	@echo "  make stop          - Para o container em execução"
	@echo "  make restart       - Reinicia o container"
	@echo "  make test          - Executa os testes"
	@echo "  make lint          - Executa o linter"
	@echo "  make logs          - Mostra os logs do container"
	@echo "  make shell         - Abre um shell no container"
	@echo "  make clean         - Remove imagens, volumes e containers"
	@echo "  make help          - Mostra esta ajuda"

# Default target
.DEFAULT_GOAL := help