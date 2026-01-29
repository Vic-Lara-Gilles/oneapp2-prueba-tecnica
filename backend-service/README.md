# Backend Service - API de Respuestas

Servicio backend para el sistema de formularios con dashboard. Implementado con Express.js + Serverless Framework, diseñado para ejecutarse en AWS Lambda y localmente usando `serverless-offline`.

## 🎯 Descripción

API RESTful que maneja respuestas de formularios con las siguientes características:

- ✅ 7 endpoints para CRUD de respuestas
- ✅ Validación con Zod
- ✅ PostgreSQL como base de datos
- ✅ Pool de conexiones optimizado
- ✅ Error handling centralizado
- ✅ CORS configurado
- ✅ Logging estructurado
- ✅ TypeScript

## 📋 Requisitos Previos

- Node.js 18.x (usa nvm con el archivo `.nvmrc`)
- npm >= 9
- PostgreSQL 14+ (via Docker/OrbStack)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)

## 🚀 Instalación

### 1. Instalar Node.js

```bash
nvm install
nvm use
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea el archivo `.env` en la raíz de `backend-service/`:

```env
DATABASE_URL=postgresql://prueba_user:prueba_password@localhost:5432/prueba_tecnica_db
NODE_ENV=development
PORT=4001
CORS_ORIGIN=http://localhost:3000
```

### 4. Iniciar PostgreSQL

Desde la raíz del proyecto:

```bash
# Opción A: Con Makefile
make db-up

# Opción B: Con Docker Compose
docker compose up -d postgres
```

## 🏃 Ejecución en Desarrollo

```bash
npm run dev
```

El servicio estará disponible en:
- **Base URL**: http://localhost:4001/dev/backend
- **Health Check**: http://localhost:4001/dev/backend/health

## 🔌 Endpoints Disponibles

### Health Check
```bash
GET /health
```
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T22:14:42.412Z",
  "database": "connected",
  "environment": "development"
}
```

### API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/responses` | Crear nueva respuesta |
| `GET` | `/api/responses/count` | Obtener total de respuestas |
| `GET` | `/api/responses/recent` | Últimas 5 respuestas |
| `GET` | `/api/responses/stats` | Estadísticas de lenguajes |
| `GET` | `/api/responses/:email` | Respuesta por email |
| `GET` | `/api/responses/check/:email` | Verificar si email existe |
| `GET` | `/api/responses` | Todas las respuestas |

## 🧪 Probar los Endpoints

### 1. Health Check
```bash
curl http://localhost:4001/dev/backend/health
```

### 2. Crear Respuesta
```bash
curl -X POST http://localhost:4001/dev/backend/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "motivation": "Me apasiona el desarrollo full stack",
    "favorite_language": "JavaScript"
  }'
```

### 3. Obtener Total de Respuestas
```bash
curl http://localhost:4001/dev/backend/api/responses/count
```

### 4. Obtener Últimas 5 Respuestas
```bash
curl http://localhost:4001/dev/backend/api/responses/recent
```

### 5. Obtener Estadísticas
```bash
curl http://localhost:4001/dev/backend/api/responses/stats
```

### 6. Buscar por Email
```bash
curl http://localhost:4001/dev/backend/api/responses/test@example.com
```

### 7. Verificar Email
```bash
curl http://localhost:4001/dev/backend/api/responses/check/test@example.com
```

## 📁 Estructura del Proyecto

```
backend-service/
├── src/
│   ├── handler.ts                # Entry point de Serverless
│   ├── app.ts                    # Configuración de Express
│   ├── routes/
│   │   └── responseRoutes.ts     # Definición de rutas
│   ├── controllers/
│   │   └── responseController.ts # Lógica de negocio
│   ├── repositories/
│   │   └── responseRepository.ts # Queries SQL
│   ├── services/
│   │   └── database.ts           # Pool de PostgreSQL
│   ├── validators/
│   │   └── responseValidator.ts  # Schemas Zod
│   └── middleware/
│       ├── validation.ts         # Validación de requests
│       └── errorHandler.ts       # Manejo de errores
├── serverless.yml                # Config Serverless Framework
├── tsconfig.json                 # Config TypeScript
├── package.json
└── .env                          # Variables de entorno
```

## 🔒 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Connection string de PostgreSQL | - (requerido) |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `4001` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |
| `DB_POOL_MAX` | Máximo de conexiones en pool | `20` |
| `DB_POOL_MIN` | Mínimo de conexiones en pool | `5` |

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia serverless-offline

# Build
npm run build            # Compila TypeScript

# Deploy (requiere AWS configurado)
npm run deploy           # Despliega a AWS Lambda

# Testing (desde raíz del proyecto)
make test-api           # Prueba automática de endpoints
```

## 🗄️ Base de Datos

### Tabla: `responses`

```sql
CREATE TABLE responses (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  motivation TEXT,
  favorite_language VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_favorite_language 
    CHECK (favorite_language IN ('JavaScript', 'Python', 'Java', 'C#', 'Otro'))
);
```

### Índices Optimizados
- `idx_responses_email` - Búsqueda por email
- `idx_responses_submitted_at` - Ordenamiento por fecha
- `idx_responses_favorite_language` - Agrupación por lenguaje

## 🔍 Validaciones

### POST /api/responses

```typescript
{
  email: z.string().email().toLowerCase().trim(),
  motivation: z.string().max(1000).optional().nullable(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
}
```

### Errores Posibles

| Código | Descripción |
|--------|-------------|
| `400` | Validación fallida (formato incorrecto) |
| `409` | Email duplicado (ya existe en BD) |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

## 📊 Respuestas de API

### Success Response (201 Created)
```json
{
  "id": 10,
  "email": "user@example.com",
  "motivation": "Me interesa...",
  "favorite_language": "JavaScript",
  "submitted_at": "2026-01-28T22:30:15.123Z"
}
```

### Error Response (409 Conflict)
```json
{
  "error": "Este email ya ha respondido el formulario"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

## 🐛 Troubleshooting

### Error: Database connection failed

**Solución**: Verifica que PostgreSQL esté corriendo
```bash
make db-status
# o
docker ps | grep postgres
```

### Error: Port 4001 already in use

**Solución**: Libera el puerto
```bash
lsof -ti:4001 | xargs kill -9
```

### Error: DATABASE_URL not defined

**Solución**: Crea el archivo `.env` con las variables requeridas

## 📚 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `express` | 4.19.2 | Framework web |
| `@codegenie/serverless-express` | 4.17.1 | Adapter Serverless |
| `pg` | 8.17.2 | Cliente PostgreSQL |
| `zod` | 4.3.6 | Validación de schemas |
| `cors` | 2.8.6 | Middleware CORS |
| `dotenv` | 17.2.3 | Variables de entorno |

## 🚀 Deploy a AWS Lambda

```bash
# Configurar AWS CLI
aws configure

# Deploy
npm run deploy

# Ver logs
serverless logs -f backend
```

## 📖 Documentación Adicional

Para más detalles, consulta:
- [README.md del proyecto](../README.md) - Documentación completa
- [DOCUMENTATION.md](../DOCUMENTATION.md) - Guía técnica detallada
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)

## 📝 Notas

- Runtime configurado: `nodejs18.x`
- Stage por defecto: `dev`
- Region: `us-east-1` (configurable)
- Timeout: 30 segundos
- Memory: 512 MB

---

**Hecho con ❤️ usando Express, Serverless y TypeScript**
