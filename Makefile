.PHONY: help install dev clean setup db-up db-down db-reset db-logs db-psql backend-install backend-dev frontend-install frontend-dev test

# Variables
DOCKER_COMPOSE = docker compose
BACKEND_DIR = backend-service
FRONTEND_DIR = frontend

# Colors for output
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

##@ General

help: ## Mostrar esta ayuda
	@echo '$(BLUE)════════════════════════════════════════════════════════════$(NC)'
	@echo '$(GREEN)  Prueba Técnica Full Stack - Makefile Commands$(NC)'
	@echo '$(BLUE)════════════════════════════════════════════════════════════$(NC)'
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ''

##@ Setup (Primera vez)

install: backend-install frontend-install ## Instalar todas las dependencias
	@echo "$(GREEN)✓ Todas las dependencias instaladas$(NC)"

setup: install db-up db-wait ## Setup completo del proyecto (primera vez)
	@echo "$(GREEN)✓ Setup completo finalizado$(NC)"
	@echo "$(YELLOW)Siguiente paso: make dev$(NC)"

##@ Docker & Database

db-up: ## Iniciar PostgreSQL con Docker
	@echo "$(BLUE)Iniciando PostgreSQL...$(NC)"
	@$(DOCKER_COMPOSE) up -d postgres
	@echo "$(GREEN)✓ PostgreSQL iniciado$(NC)"

db-up-pgadmin: ## Iniciar PostgreSQL + PgAdmin (interfaz gráfica)
	@echo "$(BLUE)Iniciando PostgreSQL + PgAdmin...$(NC)"
	@$(DOCKER_COMPOSE) --profile tools up -d
	@echo "$(GREEN)✓ PostgreSQL y PgAdmin iniciados$(NC)"
	@echo "$(YELLOW)PgAdmin: http://localhost:5050$(NC)"
	@echo "$(YELLOW)Email: admin@pruebatecnica.com | Password: admin$(NC)"

db-down: ## Detener contenedores de Docker (mantiene datos)
	@echo "$(BLUE)Deteniendo contenedores...$(NC)"
	@$(DOCKER_COMPOSE) stop
	@echo "$(GREEN)✓ Contenedores detenidos$(NC)"

db-remove: ## Detener y eliminar contenedores (mantiene volumen)
	@echo "$(RED)Eliminando contenedores...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✓ Contenedores eliminados$(NC)"

db-remove-all: ## Eliminar contenedores y volumen (BORRA TODOS LOS DATOS)
	@echo "$(RED)⚠️  ADVERTENCIA: Esto eliminará todos los datos de la base de datos$(NC)"
	@read -p "¿Estás seguro? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		echo "$(GREEN)✓ Contenedores y volumen eliminados$(NC)"; \
	else \
		echo "$(YELLOW)Cancelado$(NC)"; \
	fi

db-reset: db-remove db-up db-wait ## Resetear base de datos (elimina y recrea)
	@echo "$(GREEN)✓ Base de datos reseteada$(NC)"

db-logs: ## Ver logs de PostgreSQL
	@$(DOCKER_COMPOSE) logs -f postgres

db-ps: ## Ver estado de contenedores
	@$(DOCKER_COMPOSE) ps

db-wait: ## Esperar a que PostgreSQL esté listo
	@echo "$(BLUE)Esperando a que PostgreSQL esté listo...$(NC)"
	@timeout 30 sh -c 'until $(DOCKER_COMPOSE) exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done' || \
		(echo "$(RED)✗ Timeout esperando PostgreSQL$(NC)" && exit 1)
	@echo "$(GREEN)✓ PostgreSQL está listo$(NC)"

db-psql: ## Conectar a PostgreSQL con psql
	@$(DOCKER_COMPOSE) exec postgres psql -U postgres -d prueba_tecnica

db-seed: ## Ejecutar seed manualmente
	@echo "$(BLUE)Ejecutando seed.sql...$(NC)"
	@$(DOCKER_COMPOSE) exec -T postgres psql -U postgres -d prueba_tecnica < database/seed.sql
	@echo "$(GREEN)✓ Seed ejecutado$(NC)"

db-count: ## Contar registros en la tabla responses
	@echo "$(BLUE)Registros en tabla responses:$(NC)"
	@$(DOCKER_COMPOSE) exec postgres psql -U postgres -d prueba_tecnica -c "SELECT COUNT(*) FROM responses;"

##@ Backend

backend-install: ## Instalar dependencias del backend
	@echo "$(BLUE)Instalando dependencias del backend...$(NC)"
	@cd $(BACKEND_DIR) && npm install
	@echo "$(GREEN)✓ Dependencias del backend instaladas$(NC)"

backend-env: ## Crear archivo .env del backend
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		echo "$(BLUE)Creando .env del backend...$(NC)"; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "$(GREEN)✓ Archivo .env creado$(NC)"; \
	else \
		echo "$(YELLOW)El archivo .env ya existe$(NC)"; \
	fi

backend-dev: backend-env ## Iniciar backend en modo desarrollo
	@echo "$(BLUE)Iniciando backend en modo desarrollo...$(NC)"
	@cd $(BACKEND_DIR) && npm run dev

backend-build: ## Compilar backend
	@echo "$(BLUE)Compilando backend...$(NC)"
	@cd $(BACKEND_DIR) && npm run build
	@echo "$(GREEN)✓ Backend compilado$(NC)"

backend-deploy: ## Desplegar backend con Serverless
	@echo "$(BLUE)Desplegando backend...$(NC)"
	@cd $(BACKEND_DIR) && npx serverless deploy
	@echo "$(GREEN)✓ Backend desplegado$(NC)"

##@ Frontend

frontend-install: ## Instalar dependencias del frontend
	@echo "$(BLUE)Instalando dependencias del frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✓ Dependencias del frontend instaladas$(NC)"

frontend-env: ## Crear archivo .env.local del frontend
	@if [ ! -f $(FRONTEND_DIR)/.env.local ]; then \
		echo "$(BLUE)Creando .env.local del frontend...$(NC)"; \
		echo "NEXT_PUBLIC_API_URL=http://localhost:4001" > $(FRONTEND_DIR)/.env.local; \
		echo "$(GREEN)✓ Archivo .env.local creado$(NC)"; \
	else \
		echo "$(YELLOW)El archivo .env.local ya existe$(NC)"; \
	fi

frontend-dev: frontend-env ## Iniciar frontend en modo desarrollo
	@echo "$(BLUE)Iniciando frontend en modo desarrollo...$(NC)"
	@cd $(FRONTEND_DIR) && npm run dev

frontend-build: ## Compilar frontend
	@echo "$(BLUE)Compilando frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm run build
	@echo "$(GREEN)✓ Frontend compilado$(NC)"

##@ Development

dev: backend-env frontend-env ## Iniciar TODO en modo desarrollo (requiere 3 terminales)
	@echo "$(YELLOW)═══════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Modo Desarrollo - Instrucciones$(NC)"
	@echo "$(YELLOW)═══════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "Ejecuta estos comandos en 3 terminales diferentes:"
	@echo ""
	@echo "$(BLUE)Terminal 1 - Database:$(NC)"
	@echo "  make db-up && make db-logs"
	@echo ""
	@echo "$(BLUE)Terminal 2 - Backend:$(NC)"
	@echo "  make backend-dev"
	@echo ""
	@echo "$(BLUE)Terminal 3 - Frontend:$(NC)"
	@echo "  make frontend-dev"
	@echo ""
	@echo "$(YELLOW)URLs:$(NC)"
	@echo "  Frontend:  http://localhost:3000"
	@echo "  Backend:   http://localhost:4001"
	@echo "  Database:  postgresql://postgres:postgres@localhost:5432/prueba_tecnica"
	@echo ""

dev-status: ## Ver estado de todos los servicios
	@echo "$(BLUE)═══════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Estado de Servicios$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Containers:$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(YELLOW)Backend (port 4001):$(NC)"
	@curl -s http://localhost:4001/health > /dev/null 2>&1 && \
		echo "  $(GREEN)✓ Running$(NC)" || \
		echo "  $(RED)✗ Not running$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend (port 3000):$(NC)"
	@curl -s http://localhost:3000 > /dev/null 2>&1 && \
		echo "  $(GREEN)✓ Running$(NC)" || \
		echo "  $(RED)✗ Not running$(NC)"
	@echo ""

##@ Testing & API

test-api: ## Probar endpoints del API
	@echo "$(BLUE)Probando API endpoints...$(NC)"
	@echo ""
	@echo "$(YELLOW)GET /api/responses/count$(NC)"
	@curl -s http://localhost:4001/api/responses/count | jq . || echo "$(RED)✗ Error$(NC)"
	@echo ""
	@echo "$(YELLOW)GET /api/responses/recent$(NC)"
	@curl -s http://localhost:4001/api/responses/recent | jq . || echo "$(RED)✗ Error$(NC)"
	@echo ""
	@echo "$(YELLOW)GET /api/responses/stats$(NC)"
	@curl -s http://localhost:4001/api/responses/stats | jq . || echo "$(RED)✗ Error$(NC)"

test-post: ## Probar POST de nueva respuesta
	@echo "$(BLUE)Enviando nueva respuesta...$(NC)"
	@curl -X POST http://localhost:4001/api/responses \
		-H "Content-Type: application/json" \
		-d '{"email":"test_$(shell date +%s)@example.com","motivation":"Testing from Makefile","favorite_language":"JavaScript"}' \
		| jq . || echo "$(RED)✗ Error$(NC)"

##@ Cleanup

clean: ## Limpiar archivos temporales y build
	@echo "$(BLUE)Limpiando archivos temporales...$(NC)"
	@rm -rf $(BACKEND_DIR)/node_modules
	@rm -rf $(BACKEND_DIR)/.serverless
	@rm -rf $(BACKEND_DIR)/dist
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/.next
	@rm -rf $(FRONTEND_DIR)/out
	@echo "$(GREEN)✓ Limpieza completada$(NC)"

clean-all: clean db-remove-all ## Limpiar TODO (incluyendo base de datos)
	@echo "$(GREEN)✓ Limpieza total completada$(NC)"

##@ Git & Commits

git-status: ## Ver estado de Git
	@git status

commit-db: ## Commit para configuración de Docker
	@git add docker-compose.yml backend-service/.env.example database/README.md DOCKER_SETUP.md .gitignore Makefile
	@git commit -m "feat(docker): add Docker/OrbStack configuration with Makefile" || echo "$(YELLOW)Sin cambios para commitear$(NC)"

##@ Info

info: ## Mostrar información del proyecto
	@echo "$(BLUE)═══════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Información del Proyecto$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend:$(NC)"
	@echo "  Directorio: $(BACKEND_DIR)"
	@echo "  Node: $(shell cd $(BACKEND_DIR) && node --version 2>/dev/null || echo 'Not installed')"
	@echo "  Package Manager: npm"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@echo "  Directorio: $(FRONTEND_DIR)"
	@echo "  Node: $(shell cd $(FRONTEND_DIR) && node --version 2>/dev/null || echo 'Not installed')"
	@echo "  Package Manager: npm"
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@echo "  PostgreSQL: 14-alpine (Docker)"
	@echo "  Host: localhost:5432"
	@echo "  Database: prueba_tecnica"
	@echo "  User: postgres"
	@echo ""
	@echo "$(YELLOW)URLs:$(NC)"
	@echo "  Frontend:  http://localhost:3000"
	@echo "  Backend:   http://localhost:4001"
	@echo "  PgAdmin:   http://localhost:5050 (con --profile tools)"
	@echo ""

##@ Default

.DEFAULT_GOAL := help
