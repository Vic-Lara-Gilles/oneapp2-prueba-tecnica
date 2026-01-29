# 📚 Documentación de Implementación

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ instalado
- Docker Desktop u OrbStack (para PostgreSQL)
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd oneapp2-prueba-tecnica
```

### 2. Levantar la Base de Datos
```bash
# Iniciar PostgreSQL con Docker
make db-up

# Verificar que esté corriendo
make db-status
```

### 3. Configurar Variables de Entorno

**Backend** (`backend-service/.env`):
```env
DATABASE_URL=postgresql://prueba_user:prueba_password@localhost:5432/prueba_tecnica_db
NODE_ENV=development
PORT=4001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
```

### 4. Instalar Dependencias

```bash
# Backend
cd backend-service
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Iniciar los Servicios

**Opción 1: Usar Makefile (Recomendado)**
```bash
# Iniciar todo (base de datos, backend y frontend)
make dev

# O iniciar servicios individuales:
make backend-dev  # Solo backend
make frontend-dev # Solo frontend
```

**Opción 2: Manual**
```bash
# Terminal 1 - Backend
cd backend-service
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4001/dev/backend
- **Formulario**: http://localhost:3000/form
- **Dashboard**: http://localhost:3000/dashboard

---

## 📦 Dependencias Instaladas

### Backend (`backend-service/`)

#### Dependencies (Producción)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@codegenie/serverless-express` | ^4.17.1 | Adapter para ejecutar Express en AWS Lambda/Serverless |
| `cors` | ^2.8.6 | Middleware para habilitar CORS |
| `dotenv` | ^17.2.3 | Carga variables de entorno desde archivos `.env` |
| `express` | ^4.19.2 | Framework web para Node.js |
| `pg` | ^8.17.2 | Cliente de PostgreSQL para Node.js |
| `zod` | ^4.3.6 | Librería de validación y schemas de TypeScript |

#### DevDependencies (Desarrollo)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@serverless/typescript` | ^3.38.0 | Tipos TypeScript para Serverless Framework |
| `@types/cors` | ^2.8.19 | Tipos TypeScript para CORS |
| `@types/express` | ^4.17.21 | Tipos TypeScript para Express |
| `@types/node` | ^22.13.9 | Tipos TypeScript para Node.js |
| `@types/pg` | ^8.16.0 | Tipos TypeScript para pg |
| `serverless` | ^3.38.0 | Framework para aplicaciones serverless |
| `serverless-http` | ^3.2.0 | HTTP adapter para Serverless |
| `serverless-offline` | ^13.8.0 | Emulador local para Serverless Framework |
| `ts-node` | ^10.9.2 | Ejecución de TypeScript en Node.js |
| `typescript` | ^5.8.2 | Compilador de TypeScript |

### Frontend (`frontend/`)

#### Dependencies (Producción)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `next` | ^14.2.30 | Framework de React con SSR y App Router |
| `react` | ^18.2.0 | Librería para construir interfaces de usuario |
| `react-dom` | ^18.2.0 | Renderizado de React en el DOM |
| `zod` | ^4.3.6 | Validación de esquemas en Server Actions |

#### DevDependencies (Desarrollo)
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@eslint/eslintrc` | ^3 | Configuración de ESLint |
| `@types/node` | ^20 | Tipos TypeScript para Node.js |
| `@types/react` | ^18 | Tipos TypeScript para React |
| `@types/react-dom` | ^18 | Tipos TypeScript para ReactDOM |
| `autoprefixer` | ^10 | PostCSS plugin para autoprefixing CSS |
| `eslint` | ^8 | Linter para JavaScript/TypeScript |
| `eslint-config-next` | 14.2.15 | Configuración de ESLint para Next.js |
| `postcss` | ^8 | Procesador de CSS |
| `tailwindcss` | ^3.4.0 | Framework de CSS utility-first |
| `typescript` | ^5 | Compilador de TypeScript |

---

## 🗄️ Esquema de Base de Datos

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

-- Índices para optimizar consultas
CREATE INDEX idx_responses_email ON responses(email);
CREATE INDEX idx_responses_submitted_at ON responses(submitted_at DESC);
CREATE INDEX idx_responses_favorite_language ON responses(favorite_language);
```

### Descripción de Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único autoincremental |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email del usuario (único por respuesta) |
| `motivation` | TEXT | NULL | Respuesta a pregunta opcional de texto libre |
| `favorite_language` | VARCHAR(50) | NOT NULL, CHECK | Lenguaje de programación favorito |
| `submitted_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha y hora de envío |

### Restricciones
- **UNIQUE(email)**: Garantiza que un usuario solo puede enviar una respuesta
- **CHECK(favorite_language)**: Solo permite los valores: 'JavaScript', 'Python', 'Java', 'C#', 'Otro'

### Diagrama ER

```
┌─────────────────────────────────────┐
│           responses                 │
├─────────────────────────────────────┤
│ id (PK)                   SERIAL    │
│ email (UNIQUE)            VARCHAR   │
│ motivation                TEXT      │
│ favorite_language         VARCHAR   │
│ submitted_at             TIMESTAMPTZ│
└─────────────────────────────────────┘
```

---

## 🔌 Documentación de API Endpoints

### Base URL
```
http://localhost:4001/dev/backend
```

### 1. Health Check

**Endpoint**: `GET /health`

**Descripción**: Verifica el estado del servidor y la conexión a la base de datos

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T22:14:42.412Z",
  "database": "connected",
  "environment": "development"
}
```

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/health
```

---

### 2. Crear Nueva Respuesta

**Endpoint**: `POST /api/responses`

**Descripción**: Crea una nueva respuesta al formulario

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "usuario@example.com",
  "motivation": "Texto opcional de motivación",
  "favorite_language": "JavaScript"
}
```

**Validaciones**:
- `email`: Obligatorio, formato email válido, único en la base de datos
- `motivation`: Opcional, máximo 1000 caracteres, puede ser null
- `favorite_language`: Obligatorio, debe ser uno de: 'JavaScript', 'Python', 'Java', 'C#', 'Otro'

**Success Response** (201 Created):
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "motivation": "Texto opcional de motivación",
  "favorite_language": "JavaScript",
  "submitted_at": "2026-01-28T22:00:00.000Z"
}
```

**Error Responses**:

**400 Bad Request** (Validación fallida):
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

**409 Conflict** (Email duplicado):
```json
{
  "error": "Este email ya ha respondido el formulario"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:4001/dev/backend/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "motivation": "Me apasiona el desarrollo web",
    "favorite_language": "JavaScript"
  }'
```

**Ejemplo con JavaScript (fetch)**:
```javascript
const response = await fetch('http://localhost:4001/dev/backend/api/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    motivation: 'Me apasiona el desarrollo web',
    favorite_language: 'JavaScript'
  })
});

const data = await response.json();
```

---

### 3. Obtener Total de Respuestas

**Endpoint**: `GET /api/responses/count`

**Descripción**: Retorna el número total de respuestas almacenadas en la base de datos

**Response** (200 OK):
```json
{
  "total": 9
}
```

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/count
```

**Ejemplo con JavaScript**:
```javascript
const response = await fetch('http://localhost:4001/dev/backend/api/responses/count');
const data = await response.json();
console.log(`Total de respuestas: ${data.total}`);
```

---

### 4. Obtener Respuestas Recientes

**Endpoint**: `GET /api/responses/recent`

**Descripción**: Retorna las últimas 5 respuestas ordenadas por fecha (más reciente primero)

**Response** (200 OK):
```json
[
  {
    "id": 9,
    "email": "test@example.com",
    "motivation": "Me apasiona el desarrollo web",
    "favorite_language": "JavaScript",
    "submitted_at": "2026-01-28T22:00:00.000Z"
  },
  {
    "id": 8,
    "email": "david.ramirez@example.com",
    "motivation": "Busco nuevos desafíos técnicos",
    "favorite_language": "JavaScript",
    "submitted_at": "2026-01-27T15:30:00.000Z"
  }
  // ... hasta 5 respuestas
]
```

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/recent
```

**Ejemplo con JavaScript**:
```javascript
const response = await fetch('http://localhost:4001/dev/backend/api/responses/recent');
const recentUsers = await response.json();
recentUsers.forEach(user => {
  console.log(`${user.email} - ${new Date(user.submitted_at).toLocaleString()}`);
});
```

---

### 5. Obtener Estadísticas de Lenguajes

**Endpoint**: `GET /api/responses/stats`

**Descripción**: Retorna el conteo de respuestas agrupadas por lenguaje de programación, ordenadas por cantidad descendente

**Response** (200 OK):
```json
[
  {
    "language": "JavaScript",
    "count": 4
  },
  {
    "language": "Python",
    "count": 2
  },
  {
    "language": "Otro",
    "count": 1
  },
  {
    "language": "C#",
    "count": 1
  },
  {
    "language": "Java",
    "count": 1
  }
]
```

**Notas**:
- Los lenguajes sin respuestas no aparecen en el resultado
- El array está ordenado por `count` descendente
- Útil para generar gráficos de barras o pie charts

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/stats
```

**Ejemplo con JavaScript**:
```javascript
const response = await fetch('http://localhost:4001/dev/backend/api/responses/stats');
const stats = await response.json();
stats.forEach(stat => {
  console.log(`${stat.language}: ${stat.count} votos`);
});
```

---

### 6. Obtener Respuesta por Email

**Endpoint**: `GET /api/responses/:email`

**Descripción**: Retorna la respuesta de un usuario específico por su email

**Path Parameters**:
- `email` (string, required): Email del usuario (se codifica automáticamente en URL)

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "motivation": "Texto de motivación",
  "favorite_language": "JavaScript",
  "submitted_at": "2026-01-28T22:00:00.000Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Response not found"
}
```

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/usuario%40example.com
```

**Ejemplo con JavaScript**:
```javascript
const email = 'usuario@example.com';
const response = await fetch(
  `http://localhost:4001/dev/backend/api/responses/${encodeURIComponent(email)}`
);
const userData = await response.json();
```

---

### 7. Verificar si Email Existe

**Endpoint**: `GET /api/responses/check/:email`

**Descripción**: Verifica si un email ya ha enviado una respuesta (útil para validación en frontend)

**Path Parameters**:
- `email` (string, required): Email a verificar

**Response** (200 OK):
```json
{
  "exists": true
}
```

o

```json
{
  "exists": false
}
```

**Ejemplo con cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/check/test%40example.com
```

**Ejemplo con JavaScript**:
```javascript
const email = 'test@example.com';
const response = await fetch(
  `http://localhost:4001/dev/backend/api/responses/check/${encodeURIComponent(email)}`
);
const { exists } = await response.json();
if (exists) {
  console.log('Este email ya ha respondido el formulario');
}
```

---

## 🧪 Testing de APIs

### Usando el Makefile
```bash
# Ejecutar todos los tests de API
make test-api

# Probar endpoints individuales
make test-health
make test-count
make test-stats
make test-recent
```

### Usando cURL Manual

```bash
# 1. Verificar salud del servidor
curl http://localhost:4001/dev/backend/health

# 2. Obtener conteo
curl http://localhost:4001/dev/backend/api/responses/count

# 3. Ver estadísticas
curl http://localhost:4001/dev/backend/api/responses/stats | jq

# 4. Ver últimas respuestas
curl http://localhost:4001/dev/backend/api/responses/recent | jq

# 5. Crear nueva respuesta
curl -X POST http://localhost:4001/dev/backend/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "motivation": "Prueba de API",
    "favorite_language": "Python"
  }' | jq

# 6. Verificar email
curl http://localhost:4001/dev/backend/api/responses/check/nuevo%40test.com | jq

# 7. Buscar por email
curl http://localhost:4001/dev/backend/api/responses/nuevo%40test.com | jq
```

### Datos de Prueba
La base de datos viene con 8 registros de prueba pre-cargados:

| Email | Lenguaje | Motivación |
|-------|----------|------------|
| juan.perez@example.com | JavaScript | Sí |
| maria.gonzalez@example.com | Python | Sí |
| carlos.rodriguez@example.com | Java | No |
| ana.martinez@example.com | C# | Sí |
| luis.lopez@example.com | Otro | No |
| sofia.hernandez@example.com | Otro | Sí |
| pedro.sanchez@example.com | JavaScript | Sí |
| laura.torres@example.com | Python | Sí |

Para agregar más datos de prueba:

```bash
# Conectarse a PostgreSQL
make db-psql

# Insertar registro
INSERT INTO responses (email, motivation, favorite_language) 
VALUES ('nuevo@test.com', 'Motivación de prueba', 'Python');

# Verificar
SELECT * FROM responses ORDER BY submitted_at DESC LIMIT 5;
```

---

## 🏗️ Arquitectura de la Aplicación

### Backend Structure

```
backend-service/
├── src/
│   ├── handler.ts                    # Entry point serverless
│   ├── app.ts                        # Configuración Express
│   ├── services/
│   │   └── database.ts               # Pool de PostgreSQL
│   ├── validators/
│   │   └── responseValidator.ts      # Schemas de Zod
│   ├── middleware/
│   │   ├── validation.ts             # Middleware de validación
│   │   └── errorHandler.ts          # Manejo centralizado de errores
│   ├── repositories/
│   │   └── responseRepository.ts     # Queries SQL (Data Access Layer)
│   ├── controllers/
│   │   └── responseController.ts     # Lógica de negocio
│   └── routes/
│       └── responseRoutes.ts         # Definición de endpoints
├── dist/                             # Código compilado (generado)
├── .env                              # Variables de entorno
├── serverless.yml                    # Configuración de Serverless
├── tsconfig.json                     # Configuración TypeScript
└── package.json                      # Dependencias
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Layout principal
│   │   ├── globals.css               # Estilos globales
│   │   ├── actions/
│   │   │   └── form.ts               # Server Actions
│   │   ├── form/
│   │   │   └── page.tsx              # Página del formulario
│   │   └── dashboard/
│   │       └── page.tsx              # Página del dashboard
│   ├── components/
│   │   └── UserModal.tsx             # Modal para mostrar motivación
│   └── services/
│       └── api.ts                    # Cliente API (fetch wrapper)
├── public/                           # Archivos estáticos
├── .env.local                        # Variables de entorno
├── next.config.js                    # Configuración Next.js
├── tailwind.config.js                # Configuración Tailwind
├── tsconfig.json                     # Configuración TypeScript
└── package.json                      # Dependencias
```

### Database Structure

```
database/
├── schema.sql                        # Definición de tablas
└── seed.sql                          # Datos de prueba iniciales
```

### Docker Configuration

```
docker-compose.yml                    # Orquestación de PostgreSQL
```

### Development Tools

```
Makefile                              # Comandos de desarrollo
.gitignore                            # Archivos ignorados
README.md                             # Documentación principal
DOCUMENTATION.md                      # Este archivo
```

---

## 🔒 Seguridad Implementada

### 1. Validación de Inputs
- **Backend**: Zod valida todos los datos antes de procesar
- **Frontend**: Validación en Server Actions con Zod
- Sanitización automática de datos

### 2. SQL Injection Prevention
- Uso exclusivo de **parameterized queries** con `pg`
- Nunca se concatenan strings SQL con inputs del usuario
- Ejemplo:
  ```typescript
  // ✅ CORRECTO
  await query('SELECT * FROM responses WHERE email = $1', [email])
  
  // ❌ INCORRECTO (vulnerable)
  await query(`SELECT * FROM responses WHERE email = '${email}'`)
  ```

### 3. CORS Configuration
- CORS configurado para permitir solo el frontend en desarrollo
- Producción: Debe configurarse con dominio específico
- Headers permitidos controlados

### 4. Database Constraints
- **UNIQUE(email)**: Previene respuestas duplicadas a nivel de BD
- **CHECK(favorite_language)**: Solo permite valores válidos
- **NOT NULL**: Campos obligatorios garantizados

### 5. TypeScript Strict Mode
- Tipos estrictos en todo el código
- `strict: true` en tsconfig.json
- Previene errores de tipo en tiempo de compilación

### 6. Error Handling
- Manejo centralizado de errores
- No se exponen detalles internos al frontend
- Logs apropiados en servidor

### 7. Environment Variables
- Credenciales nunca en código
- Archivos `.env` en `.gitignore`
- Validación de variables requeridas al inicio

---

## 🐛 Troubleshooting

### Backend no se conecta a la base de datos

**Síntomas**: Error "Connection refused" o "ECONNREFUSED"

**Soluciones**:
```bash
# 1. Verificar que PostgreSQL esté corriendo
make db-status

# 2. Ver logs de la base de datos
make db-logs

# 3. Reiniciar base de datos
make db-restart

# 4. Verificar DATABASE_URL en backend-service/.env
cat backend-service/.env | grep DATABASE_URL
```

---

### Puerto 4001 o 4101 en uso

**Síntomas**: "EADDRINUSE: address already in use"

**Soluciones**:
```bash
# Liberar puertos manualmente
lsof -ti:4001 | xargs kill -9
lsof -ti:4101 | xargs kill -9

# O usar Makefile
make clean
```

---

### Frontend no carga datos del backend

**Síntomas**: Dashboard muestra errores o datos vacíos

**Soluciones**:
1. Verificar que el backend esté corriendo:
   ```bash
   curl http://localhost:4001/dev/backend/health
   ```

2. Verificar `.env.local` en frontend:
   ```bash
   cat frontend/.env.local
   # Debe contener: NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
   ```

3. Revisar la consola del navegador (F12) para errores de CORS o fetch

4. Verificar que el backend tenga CORS habilitado:
   ```typescript
   // backend-service/src/app.ts debe tener:
   app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }))
   ```

---

### Error "Cannot find module 'zod'"

**Síntomas**: TypeScript no encuentra zod

**Soluciones**:
```bash
# Frontend
cd frontend
npm install zod

# Backend
cd backend-service
npm install zod
```

---

### Base de datos sin datos de prueba

**Síntomas**: Dashboard muestra 0 respuestas

**Soluciones**:
```bash
# Resetear base de datos con seed data
make db-reset

# O insertar manualmente
make db-psql
# Dentro de psql:
INSERT INTO responses (email, motivation, favorite_language) 
VALUES ('test@example.com', 'Prueba', 'JavaScript');
```

---

### TypeScript compilation errors

**Síntomas**: `npm run build` falla

**Soluciones**:
```bash
# Backend
cd backend-service
rm -rf dist node_modules
npm install
npm run build

# Frontend
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

### Docker no inicia PostgreSQL

**Síntomas**: `make db-up` falla

**Soluciones**:
```bash
# Verificar que Docker esté corriendo
docker --version
docker ps

# Limpiar volúmenes de Docker
docker-compose down -v
docker-compose up -d

# Ver logs detallados
docker-compose logs -f postgres
```

---

## 📊 Comandos Útiles del Makefile

### Base de Datos
```bash
make db-up          # Iniciar PostgreSQL con Docker
make db-down        # Detener PostgreSQL
make db-restart     # Reiniciar PostgreSQL
make db-reset       # Resetear DB (drop + recreate + seed)
make db-logs        # Ver logs de PostgreSQL
make db-psql        # Conectar a psql interactivo
make db-status      # Ver estado de PostgreSQL
```

### Backend
```bash
make backend-dev    # Iniciar backend en modo desarrollo
make backend-build  # Compilar TypeScript
make backend-clean  # Limpiar archivos compilados
```

### Frontend
```bash
make frontend-dev   # Iniciar frontend en modo desarrollo
make frontend-build # Build de producción
make frontend-clean # Limpiar .next y cache
```

### Testing
```bash
make test-api       # Probar todos los endpoints
make test-health    # Solo health check
make test-count     # Solo contador
make test-stats     # Solo estadísticas
make test-recent    # Solo recientes
```

### General
```bash
make dev            # Iniciar todo (DB + Backend + Frontend)
make stop           # Detener todos los servicios
make clean          # Limpiar todos los archivos generados
make logs           # Ver logs de todos los servicios
make help           # Ver todos los comandos disponibles
```

---

## 🎨 Patrones y Best Practices Implementados

### Backend

#### 1. Repository Pattern
Separación entre lógica de negocio y acceso a datos:
```typescript
// repositories/responseRepository.ts
export const responseRepository = {
  async create(data) { /* SQL */ },
  async findByEmail(email) { /* SQL */ }
}

// controllers/responseController.ts
export const responseController = {
  async create(req, res) {
    const result = await responseRepository.create(req.body)
    res.status(201).json(result)
  }
}
```

#### 2. Middleware Pattern
Validación y manejo de errores centralizados:
```typescript
// routes/responseRoutes.ts
router.post('/', 
  validate(createResponseSchema),  // Validación
  responseController.create        // Controlador
)
```

#### 3. Singleton Pattern
Pool de base de datos reutilizable:
```typescript
// services/database.ts
const pool = new Pool({ /* config */ })
export const query = (text, params) => pool.query(text, params)
```

#### 4. Error Handling
Clases de error personalizadas:
```typescript
class ConflictError extends Error {
  statusCode = 409
}
```

### Frontend

#### 1. Server Actions Pattern
Lógica de servidor en Next.js 14:
```typescript
'use server'
export async function submitResponse(prevState, formData) {
  const result = await api.createResponse(data)
  return { success: true, data: result }
}
```

#### 2. Component Composition
Componentes reutilizables y modulares:
```typescript
<UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
```

#### 3. API Client Pattern
Cliente centralizado para fetch:
```typescript
// services/api.ts
export async function createResponse(data) {
  const response = await fetch(`${API_URL}/api/responses`, { /* ... */ })
  return response.json()
}
```

---

## 📝 Notas sobre Swagger/OpenAPI

Para la documentación de APIs, se optó por **documentación manual en este archivo** en lugar de Swagger porque:

### ✅ Ventajas de la documentación manual
1. **Simplicidad**: No requiere dependencias adicionales
2. **Rapidez**: Más rápido de implementar para proyectos pequeños
3. **Flexibilidad**: Formato Markdown legible en cualquier editor
4. **Ejemplos concretos**: Incluye ejemplos directos con cURL y JavaScript
5. **Git-friendly**: Fácil de versionar y revisar en PRs

### 🔧 Si prefieres implementar Swagger

Puedes agregar Swagger instalando:

```bash
cd backend-service
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

Y configurando en `backend-service/src/app.ts`:

```typescript
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Formularios',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:4001/dev/backend' }
    ]
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

Luego acceder a: http://localhost:4001/dev/backend/api-docs

---

## 🚀 Próximos Pasos (Mejoras Potenciales)

### Funcionalidades
- [ ] Paginación en endpoint de respuestas
- [ ] Filtros por fecha y lenguaje
- [ ] Exportación de datos a CSV/Excel
- [ ] Gráficos interactivos en dashboard (Chart.js/Recharts)
- [ ] Notificaciones por email al enviar formulario

### Técnicas
- [ ] Implementar tests unitarios (Jest)
- [ ] Tests de integración (Supertest)
- [ ] Tests E2E (Playwright/Cypress)
- [ ] CI/CD con GitHub Actions
- [ ] Docker Compose para todo el stack
- [ ] Migraciones de BD con herramientas (Flyway/Knex)

### Infraestructura
- [ ] Deploy en Vercel (frontend)
- [ ] Deploy en AWS Lambda (backend)
- [ ] Base de datos en RDS/Supabase
- [ ] Monitoreo con Sentry
- [ ] Logs centralizados

---

## 📧 Contacto y Soporte

Si encuentras problemas o tienes preguntas sobre esta implementación:

1. Revisa esta documentación completa
2. Verifica los logs de los servicios
3. Consulta el código fuente con comentarios
4. Usa los comandos del Makefile para diagnóstico

---

**Última actualización**: 28 de Enero, 2026  
**Versión**: 1.0.0  
**Autor**: Equipo de Desarrollo
