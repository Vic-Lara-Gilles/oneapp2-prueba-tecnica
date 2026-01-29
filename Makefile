.PHONY: start stop install dev clean db-up db-down db-reset db-psql logs status

# Comando principal - instala todo y ejecuta
start: install env db-up db-wait
	@echo "\n✅ Todo listo! Ejecuta en 2 terminales:"
	@echo "   Terminal 1: make backend"
	@echo "   Terminal 2: make frontend"
	@echo "\n📍 URLs:"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:4001"
	@echo "   Formulario: http://localhost:3000/form"
	@echo "   Dashboard:  http://localhost:3000/dashboard\n"

# Instalar dependencias
install:
	@echo "📦 Instalando dependencias..."
	@cd backend-service && npm install
	@cd frontend && npm install
	@echo "✅ Dependencias instaladas"

# Crear archivos .env si no existen
env:
	@test -f backend-service/.env || cp backend-service/.env.example backend-service/.env
	@test -f frontend/.env.local || cp frontend/.env.local.example frontend/.env.local
	@echo "✅ Archivos .env configurados"

# Base de datos
db-up:
	@echo "🐘 Iniciando PostgreSQL..."
	@docker compose up -d postgres
	@echo "✅ PostgreSQL iniciado"

db-wait:
	@echo "⏳ Esperando PostgreSQL..."
	@sleep 3
	@until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done
	@echo "✅ PostgreSQL listo"

db-down:
	@docker compose stop

db-reset: db-down
	@docker compose down -v
	@$(MAKE) db-up db-wait
	@echo "✅ Base de datos reseteada"

db-psql:
	@docker compose exec postgres psql -U postgres -d prueba_tecnica

# Desarrollo
backend:
	@cd backend-service && npm run dev

frontend:
	@cd frontend && npm run dev

# Utilidades
logs:
	@docker compose logs -f postgres

status:
	@echo "\n📊 Estado de servicios:"
	@docker compose ps
	@echo ""
	@curl -s http://localhost:4001/dev/backend/health > /dev/null 2>&1 && echo "✅ Backend: OK" || echo "❌ Backend: No disponible"
	@curl -s http://localhost:3000 > /dev/null 2>&1 && echo "✅ Frontend: OK" || echo "❌ Frontend: No disponible"

stop:
	@docker compose down
	@echo "✅ Servicios detenidos"

clean: stop
	@rm -rf backend-service/node_modules frontend/node_modules frontend/.next
	@echo "✅ Limpieza completa"

# Ayuda
help:
	@echo "\n🚀 Comandos disponibles:\n"
	@echo "  make start    - Instala todo y prepara el proyecto"
	@echo "  make backend  - Inicia el backend (terminal 1)"
	@echo "  make frontend - Inicia el frontend (terminal 2)"
	@echo "  make status   - Ver estado de servicios"
	@echo "  make stop     - Detener todo"
	@echo "  make clean    - Limpiar node_modules y cache"
	@echo "  make db-psql  - Conectar a PostgreSQL"
	@echo "  make db-reset - Resetear base de datos\n"
