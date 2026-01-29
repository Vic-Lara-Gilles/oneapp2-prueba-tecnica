# Database Setup Guide

Este directorio contiene los scripts de inicialización y configuración de la base de datos PostgreSQL.

## 📋 Contenido

- `schema.sql` - Definición de tablas, índices y constraints
- `seed.sql` - Datos de prueba para desarrollo

---

## 🐳 Setup Recomendado: Docker/OrbStack

### Prerequisitos

- **Docker Desktop** o **OrbStack** (recomendado para macOS) instalado
- OrbStack: https://orbstack.dev/

### Iniciar Base de Datos

Desde la raíz del proyecto:

```bash
# Iniciar PostgreSQL (automáticamente ejecuta schema.sql y seed.sql)
docker compose up -d postgres

# Ver logs para confirmar inicialización
docker compose logs -f postgres

# Verificar que está corriendo
docker compose ps
```

### Conexión a la Base de Datos

```bash
# Conectarse con psql desde Docker
docker compose exec postgres psql -U postgres -d prueba_tecnica

# Comandos útiles dentro de psql:
\dt              # Listar tablas
\d responses     # Describir tabla responses
SELECT * FROM responses;  # Ver datos
\q               # Salir
```

### Variables de Entorno

Crea un archivo `.env` en `backend-service/`:

```bash
cp backend-service/.env.example backend-service/.env
```

El archivo `.env` debe contener:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prueba_tecnica
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Detener y Reiniciar

```bash
# Detener contenedor (mantiene datos)
docker compose stop

# Iniciar contenedor existente
docker compose start

# Detener y eliminar contenedor (mantiene volumen)
docker compose down

# Eliminar TODO (incluyendo datos persistentes)
docker compose down -v
```

### PgAdmin (Interfaz Gráfica) - Opcional

```bash
# Iniciar PostgreSQL + PgAdmin
docker compose --profile tools up -d

# Acceder a PgAdmin:
# URL: http://localhost:5050
# Email: admin@pruebatecnica.com
# Password: admin

# Agregar servidor en PgAdmin:
# - Host: postgres (nombre del servicio Docker)
# - Port: 5432
# - Username: postgres
# - Password: postgres
# - Database: prueba_tecnica
```

### Resetear Base de Datos

```bash
# Opción 1: Eliminar y recrear contenedor (ejecuta scripts de nuevo)
docker compose down
docker compose up -d postgres

# Opción 2: Ejecutar scripts manualmente
docker compose exec postgres psql -U postgres -d prueba_tecnica -f /docker-entrypoint-initdb.d/01-schema.sql
docker compose exec postgres psql -U postgres -d prueba_tecnica -f /docker-entrypoint-initdb.d/02-seed.sql
```

---

## 🖥️ Opción Alternativa: PostgreSQL Local (sin Docker)

## 📋 Requisitos

- PostgreSQL 14+ instalado y corriendo
- Acceso a `psql` command line tool

## 🚀 Setup Rápido

### 1. Crear Base de Datos

```bash
# Acceder a PostgreSQL
psql postgres

# Crear base de datos
CREATE DATABASE prueba_tecnica;

# Salir
\q
```

### 2. Ejecutar Schema

```bash
# Conectar a la base de datos y ejecutar schema
psql -d prueba_tecnica -f database/schema.sql
```

### 3. (Opcional) Cargar Datos de Prueba

```bash
# Cargar seed data para desarrollo
psql -d prueba_tecnica -f database/seed.sql
```

## 🔧 Configuración de Variables de Entorno

Crea un archivo `.env` en `backend-service/`:

```bash
# Formato de CONNECTION STRING
DATABASE_URL=postgresql://username:password@localhost:5432/prueba_tecnica

# Ejemplos:
# Local: postgresql://postgres:postgres@localhost:5432/prueba_tecnica
# Render: postgresql://user:pass@host.render.com:5432/database
# Railway: postgresql://user:pass@host.railway.app:5432/railway
```

## 📊 Comandos Útiles

### Verificar Tabla

```bash
psql -d prueba_tecnica -c "\d responses"
```

### Ver Datos

```bash
psql -d prueba_tecnica -c "SELECT * FROM responses ORDER BY submitted_at DESC LIMIT 5;"
```

### Estadísticas

```bash
psql -d prueba_tecnica -c "SELECT favorite_language, COUNT(*) FROM responses GROUP BY favorite_language;"
```

### Limpiar Datos

```bash
psql -d prueba_tecnica -c "TRUNCATE TABLE responses RESTART IDENTITY CASCADE;"
```

## 🔒 Seguridad

**IMPORTANTE**: 
- ✅ El archivo `.env` está en `.gitignore`
- ❌ NUNCA commitear credenciales
- ✅ Usar variables de entorno en producción

## 📝 Estructura de la Tabla

```sql
responses
├── id (SERIAL PRIMARY KEY)
├── email (VARCHAR(255) UNIQUE NOT NULL)
├── motivation (TEXT NULL)
├── favorite_language (VARCHAR(50) NOT NULL)
└── submitted_at (TIMESTAMP WITH TIME ZONE)

Constraints:
- UNIQUE: email
- CHECK: favorite_language IN ('JavaScript', 'Python', 'Java', 'C#', 'Otro')

Indexes:
- idx_responses_email (email)
- idx_responses_submitted_at (submitted_at DESC)
- idx_responses_favorite_language (favorite_language)
```

## 🐘 Servicios PostgreSQL Recomendados

### Desarrollo Local
- **PostgreSQL.app** (macOS)
- **Homebrew** (macOS): `brew install postgresql@14`
- **Docker**: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14`

### Producción (Free Tier)
- **Render** - https://render.com (PostgreSQL gratis)
- **Railway** - https://railway.app (500h gratis/mes)
- **Supabase** - https://supabase.com (PostgreSQL + extras)
- **Neon** - https://neon.tech (serverless PostgreSQL)

## 🔧 Troubleshooting

### Error: "database does not exist"
```bash
createdb prueba_tecnica
```

### Error: "connection refused"
```bash
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Error: "role does not exist"
```bash
createuser -s postgres
```

### Verificar PostgreSQL está corriendo
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Cualquier OS
psql --version
```
