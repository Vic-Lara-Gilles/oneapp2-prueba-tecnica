# 🚀 Sistema de Formularios con Dashboard - Full Stack

## 📋 Descripción del Proyecto

Aplicación Full Stack que permite a los usuarios responder un cuestionario de aplicación y visualizar estadísticas en tiempo real a través de un dashboard administrativo.

### ✨ Características Principales

- ✅ **Formulario de respuestas** con validación en tiempo real
- ✅ **Dashboard interactivo** con 3 componentes principales
- ✅ **Prevención de respuestas duplicadas** por email
- ✅ **Estadísticas en tiempo real** de lenguajes favoritos
- ✅ **Interfaz responsive** diseñada con Tailwind CSS
- ✅ **API RESTful** completa con 7 endpoints

## 🎯 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14.2.30 (App Router)
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.0
- **Validación**: Zod 4.3.6
- **Tipo**: TypeScript 5.x

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.19.2
- **Serverless**: Serverless Framework + serverless-offline
- **Database Client**: node-postgres (pg) 8.17.2
- **Validación**: Zod 4.3.6
- **Tipo**: TypeScript 5.8.2

### Base de Datos
- **Motor**: PostgreSQL 14 (Alpine)
- **Orquestación**: Docker Compose / OrbStack
- **Puertos**: 5432 (local)

---

## 📸 Capturas de Pantalla

### Aplicación Funcionando

| Vista | Descripción |
|-------|-------------|
| ![Home](screenshots/01-home-page.png) | Página principal con navegación |
| ![Form](screenshots/02-form-empty.png) | Formulario de respuestas |
| ![Dashboard](screenshots/06-dashboard.png) | Dashboard con 3 componentes (contador, usuarios recientes, estadísticas) |
| ![Modal](screenshots/07-modal-open.png) | Modal mostrando motivación de usuario |

### Funcionalidades Demostradas

- ✅ **Validación de formulario** con mensajes de error
- ✅ **Email único**: Error 409 al intentar duplicar
- ✅ **Datos de prueba**: 10+ registros en base de datos
- ✅ **Modal interactivo**: Click en usuario muestra motivación
- ✅ **Estadísticas**: Conteo por lenguaje de programación

> Ver carpeta `screenshots/` para más capturas detalladas

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- ✅ Node.js 18+ instalado
- ✅ Docker Desktop u OrbStack (para PostgreSQL)
- ✅ npm o yarn
- ✅ Git

### 1️⃣ Clonar el Repositorio

```bash
git clone <repository-url>
cd oneapp2-prueba-tecnica
```

### 2️⃣ Instalar Dependencias

**Opción A: Con Makefile (Recomendado)**
```bash
make install
```

**Opción B: Manual**
```bash
# Backend
cd backend-service
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Configurar Variables de Entorno

> **Seguridad**: Los archivos `.env` están en `.gitignore` y NUNCA deben subirse al repositorio. Use los archivos `.env.example` como templates.

**Backend** - Crear `backend-service/.env`:
```bash
# Copiar desde template
cp backend-service/.env.example backend-service/.env

# O crear manualmente con estas variables:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prueba_tecnica
NODE_ENV=development
PORT=4001
CORS_ORIGIN=http://localhost:3000
```

> **Buenas Prácticas**: Los archivos `.env` NUNCA deben subirse a git. Use los archivos `.env.example` como templates.

**Frontend** - Crear `frontend/.env.local`:
```bash
# Copiar desde template
cp frontend/.env.local.example frontend/.env.local

# O crear manualmente con:
NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
```

> **Nota**: Los archivos `.env` y `.env.local` están protegidos por `.gitignore`

### 4️⃣ Iniciar la Base de Datos

```bash
# Con Makefile
make db-up

# O con Docker directamente
docker compose up -d postgres
```

La base de datos se inicializa automáticamente con:
- ✅ Tabla `responses` creada
- ✅ Índices optimizados
- ✅ Datos de prueba (seed)

### 5️⃣ Iniciar los Servicios

**Opción A: Con Makefile (TODO en uno)**
```bash
make dev
```
Esto inicia:
- 🗄️ PostgreSQL (puerto 5432)
- ⚙️ Backend API (puerto 4001)
- 🌐 Frontend Next.js (puerto 3000)

**Opción B: Manual (3 terminales)**
```bash
# Terminal 1 - Base de datos
make db-up

# Terminal 2 - Backend
cd backend-service
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 6️⃣ Acceder a la Aplicación

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Página principal |
| **Formulario** | http://localhost:3000/form | Página del formulario |
| **Dashboard** | http://localhost:3000/dashboard | Panel de estadísticas |
| **Backend API** | http://localhost:4001/dev/backend | API RESTful |
| **Health Check** | http://localhost:4001/dev/backend/health | Estado del servidor |

---

## 📝 Funcionalidades Implementadas

### 1. Formulario de Respuestas

El formulario incluye **exactamente** las siguientes preguntas según especificaciones:

#### Pregunta 1: Texto Libre (OPCIONAL)
- **Pregunta**: "¿Qué te motivó a aplicar a esta posición?"
- **Tipo**: Textarea
- **Validación**: 
  - Opcional (puede quedar vacío)
  - Máximo 1000 caracteres

#### Pregunta 2: Selección Múltiple (OBLIGATORIA)
- **Pregunta**: "¿Cuál es tu lenguaje de programación favorito?"
- **Tipo**: Radio buttons
- **Opciones**: JavaScript, Python, Java, C#, Otro
- **Validación**: Obligatoria

#### Campo de Identificación (OBLIGATORIO)
- **Campo**: Correo electrónico
- **Validación**:
  - Obligatorio
  - Formato email válido
  - ⚠️ **CRÍTICO**: Un usuario NO puede enviar más de una respuesta
  - Error 409 si el email ya existe

### 2. Dashboard de Estadísticas

#### Componente 1: Contador de Respuestas
- Muestra el número total de respuestas almacenadas
- Actualizable en tiempo real
- Ícono visual con badge

#### Componente 2: Últimos Usuarios
- Lista de los últimos 5 usuarios que respondieron
- Muestra: email + fecha/hora de respuesta
- **✨ Funcionalidad adicional**: Al hacer clic en cualquier usuario, se abre un modal mostrando su respuesta a la pregunta de motivación

#### Componente 3: Estadísticas de Selección Múltiple
- Gráfico de barras horizontal
- Muestra cuántas veces se seleccionó cada lenguaje
- Incluye porcentaje del total
- Ordenado por popularidad (de mayor a menor)

**Ejemplo de visualización:**
```
JavaScript: 15 respuestas (45%) ████████████████████
Python:      8 respuestas (24%) ███████████
Java:        3 respuestas  (9%) ████
C#:          2 respuestas  (6%) ███
Otro:        1 respuesta   (3%) █
```

---

## 🗄️ Base de Datos

### Esquema de la Tabla `responses`

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

### Descripción de Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único autoincremental |
| `email` | VARCHAR(255) | NOT NULL, **UNIQUE** | Email del usuario (único por respuesta) |
| `motivation` | TEXT | NULLABLE | Respuesta opcional a pregunta de texto libre |
| `favorite_language` | VARCHAR(50) | NOT NULL, CHECK | Lenguaje de programación favorito |
| `submitted_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha y hora de envío |

### Índices para Optimización

```sql
-- Búsqueda rápida por email (verificación de duplicados)
CREATE INDEX idx_responses_email ON responses(email);

-- Ordenamiento por fecha (últimas 5 respuestas)
CREATE INDEX idx_responses_submitted_at ON responses(submitted_at DESC);

-- Agrupación por lenguaje (estadísticas)
CREATE INDEX idx_responses_favorite_language ON responses(favorite_language);
```

### Diagrama ER

```
┌─────────────────────────────────────────┐
│           responses                     │
├─────────────────────────────────────────┤
│ • id (PK)                    SERIAL     │
│ • email (UNIQUE)             VARCHAR    │
│ • motivation                 TEXT       │
│ • favorite_language (CHECK)  VARCHAR    │
│ • submitted_at               TIMESTAMPTZ│
└─────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:4001/dev/backend
```

### 1. Health Check

```http
GET /health
```

**Respuesta** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T22:14:42.412Z",
  "database": "connected",
  "environment": "development"
}
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/health
```

---

### 2. Crear Nueva Respuesta

```http
POST /api/responses
Content-Type: application/json
```

**Body**:
```json
{
  "email": "usuario@example.com",
  "motivation": "Me apasiona el desarrollo web full stack",
  "favorite_language": "JavaScript"
}
```

**Validaciones**:
- `email`: Obligatorio, formato válido, único
- `motivation`: Opcional, máximo 1000 caracteres
- `favorite_language`: Obligatorio, uno de: 'JavaScript', 'Python', 'Java', 'C#', 'Otro'

**Respuesta Exitosa** (201 Created):
```json
{
  "id": 10,
  "email": "usuario@example.com",
  "motivation": "Me apasiona el desarrollo web full stack",
  "favorite_language": "JavaScript",
  "submitted_at": "2026-01-28T22:30:15.123Z"
}
```

**Error: Email Duplicado** (409 Conflict):
```json
{
  "error": "Este email ya ha respondido el formulario"
}
```

**Error: Validación Fallida** (400 Bad Request):
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

**Ejemplo cURL**:
```bash
curl -X POST http://localhost:4001/dev/backend/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "motivation": "Me interesa el stack tecnológico",
    "favorite_language": "Python"
  }'
```

---

### 3. Obtener Total de Respuestas

```http
GET /api/responses/count
```

**Respuesta** (200 OK):
```json
{
  "total": 42
}
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/count
```

---

### 4. Obtener Últimas 5 Respuestas

```http
GET /api/responses/recent
```

**Respuesta** (200 OK):
```json
[
  {
    "id": 42,
    "email": "user5@example.com",
    "motivation": "Me gusta este proyecto",
    "favorite_language": "JavaScript",
    "submitted_at": "2026-01-28T22:30:00.000Z"
  },
  {
    "id": 41,
    "email": "user4@example.com",
    "motivation": null,
    "favorite_language": "Python",
    "submitted_at": "2026-01-28T22:25:00.000Z"
  }
]
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/recent
```

---

### 5. Obtener Estadísticas de Lenguajes

```http
GET /api/responses/stats
```

**Respuesta** (200 OK):
```json
[
  {
    "language": "JavaScript",
    "count": 15
  },
  {
    "language": "Python",
    "count": 8
  },
  {
    "language": "Java",
    "count": 3
  },
  {
    "language": "C#",
    "count": 2
  },
  {
    "language": "Otro",
    "count": 1
  }
]
```

**SQL Ejecutado**:
```sql
SELECT favorite_language, COUNT(*) as count
FROM responses
GROUP BY favorite_language
ORDER BY count DESC
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/stats
```

---

### 6. Obtener Respuesta por Email

```http
GET /api/responses/:email
```

**Ejemplo**: `GET /api/responses/test@example.com`

**Respuesta** (200 OK):
```json
{
  "id": 10,
  "email": "test@example.com",
  "motivation": "Me interesa el desarrollo backend",
  "favorite_language": "Python",
  "submitted_at": "2026-01-28T22:15:30.000Z"
}
```

**Error: No Encontrado** (404 Not Found):
```json
{
  "error": "Respuesta no encontrada"
}
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/test@example.com
```

---

### 7. Verificar si Email Existe

```http
GET /api/responses/check/:email
```

**Ejemplo**: `GET /api/responses/check/test@example.com`

**Respuesta** (200 OK):
```json
{
  "exists": true
}
```

**Ejemplo cURL**:
```bash
curl http://localhost:4001/dev/backend/api/responses/check/test@example.com
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
oneapp2-prueba-tecnica/
├── 📁 backend-service/           # Servicio Backend (Serverless + Express)
│   ├── 📁 src/
│   │   ├── handler.ts            # Entry point para Serverless
│   │   ├── app.ts                # Configuración de Express
│   │   ├── 📁 routes/
│   │   │   └── responseRoutes.ts # Definición de rutas
│   │   ├── 📁 controllers/
│   │   │   └── responseController.ts # Lógica de negocio
│   │   ├── 📁 repositories/
│   │   │   └── responseRepository.ts # Queries SQL
│   │   ├── 📁 services/
│   │   │   └── database.ts       # Pool de PostgreSQL
│   │   ├── 📁 validators/
│   │   │   └── responseValidator.ts # Schemas Zod
│   │   └── 📁 middleware/
│   │       ├── validation.ts     # Middleware de validación
│   │       └── errorHandler.ts   # Manejo de errores
│   ├── serverless.yml            # Config Serverless Framework
│   ├── tsconfig.json
│   ├── package.json
│   └── .env                      # Variables de entorno
│
├── 📁 frontend/                  # Frontend Next.js 14 (App Router)
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── page.tsx          # Página principal
│   │   │   ├── layout.tsx        # Layout global + Metadata SEO
│   │   │   ├── loading.tsx       # Loading UI global
│   │   │   ├── error.tsx         # Error boundary global
│   │   │   ├── global-error.tsx  # Error boundary crítico
│   │   │   ├── not-found.tsx     # Página 404 personalizada
│   │   │   ├── globals.css       # Estilos Tailwind
│   │   │   ├── 📁 _components/   # Componentes privados home
│   │   │   │   ├── NavigationCard.tsx
│   │   │   │   └── TechStack.tsx
│   │   │   ├── 📁 form/
│   │   │   │   ├── page.tsx      # Página del formulario
│   │   │   │   ├── actions.ts    # Server Actions (colocation)
│   │   │   │   ├── layout.tsx    # Metadata SEO
│   │   │   │   ├── loading.tsx   # Loading skeleton
│   │   │   │   └── error.tsx     # Error boundary
│   │   │   └── 📁 dashboard/
│   │   │       ├── page.tsx      # Página del dashboard
│   │   │       ├── layout.tsx    # Metadata SEO
│   │   │       ├── loading.tsx   # Loading skeleton
│   │   │       ├── error.tsx     # Error boundary
│   │   │       └── 📁 _components/  # Componentes privados
│   │   │           ├── ResponseCounter.tsx
│   │   │           ├── LanguageStatsCard.tsx
│   │   │           ├── RecentUsersList.tsx
│   │   │           └── UserModal.tsx  # Modal de motivación
│   │   └── 📁 services/
│   │       ├── api.ts            # Cliente API (fetch)
│   │       └── api.types.ts      # Tipos TypeScript
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local                # Variables de entorno
│
├── 📁 database/
│   ├── schema.sql                # Definición de tabla
│   └── seed.sql                  # Datos de prueba
│
├── docker-compose.yml            # PostgreSQL + PgAdmin (opcional)
├── Makefile                      # Comandos de automatización
├── README.md                     # Este archivo
└── DOCUMENTATION.md              # Documentación técnica completa
```

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  page.tsx    │  │  form/page    │  │ dashboard/page  │  │
│  │  (Landing)   │  │  (Formulario) │  │ (Estadísticas)  │  │
│  └──────────────┘  └───────┬───────┘  └────────┬────────┘  │
│                            │                    │           │
│                     ┌──────▼──────┐    ┌────────▼──────┐   │
│                     │ Server      │    │  API Client   │   │
│                     │ Action      │    │  (fetch)      │   │
│                     └──────┬──────┘    └────────┬──────┘   │
└─────────────────────────────┼──────────────────┼───────────┘
                              │                   │
                     ┌────────▼───────────────────▼──────┐
                     │      HTTP/JSON (CORS enabled)     │
                     └────────┬───────────────────┬──────┘
                              │                   │
┌─────────────────────────────▼───────────────────▼───────────┐
│             BACKEND (Express + Serverless)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  handler.ts → app.ts → responseRoutes.ts            │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼────────────────────┐             │
│  │  responseController.ts (Business Logic)    │             │
│  └──────────────────────┬────────────────────┘             │
│                         │                                   │
│  ┌──────────────────────▼────────────────────┐             │
│  │  responseRepository.ts (SQL Queries)       │             │
│  └──────────────────────┬────────────────────┘             │
└─────────────────────────┼─────────────────────────────────┘
                          │
            ┌─────────────▼──────────────┐
            │  database.ts (Pool)        │
            └─────────────┬──────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────┐
│              DATABASE (PostgreSQL 14)                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │  responses table                                   │   │
│  │  - id, email (UNIQUE), motivation,                 │   │
│  │    favorite_language, submitted_at                 │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

### Patrones de Diseño Implementados

#### Backend
1. **Repository Pattern**: Capa de abstracción para operaciones de base de datos
2. **MVC (Model-View-Controller)**: Separación de responsabilidades
3. **Singleton Pattern**: Pool de conexiones PostgreSQL
4. **Middleware Pattern**: Validación y manejo de errores

#### Frontend
5. **Server Actions**: Validación y mutación en servidor (Next.js 14)
6. **Colocation Pattern**: Server Actions y componentes junto a rutas
7. **Private Folders Pattern**: Componentes privados con prefijo `_` (no ruteables)
8. **Error Boundaries**: Manejo granular de errores por ruta
9. **Loading States**: Suspense boundaries con skeletons
10. **SEO Optimization**: Metadata por ruta con OpenGraph/Twitter Cards

---

## 🧠 Conceptos Técnicos Clave

### 1. Serverless Framework

#### ¿Qué es Serverless?

**Serverless NO significa "sin servidor"**, sino que **no administras el servidor**. Es un modelo donde:
- AWS Lambda ejecuta tu código solo cuando se necesita
- Pagas solo por el tiempo de ejecución (no por servidor 24/7)
- Escala automáticamente según la demanda

#### Serverless Framework en este Proyecto

```yaml
# backend-service/serverless.yml
service: backend
provider:
  name: aws                      # Preparado para AWS Lambda
  runtime: nodejs18.x

plugins:
  - serverless-offline            # 🔥 Simula Lambda en local

functions:
  api:
    handler: dist/handler.handler # Punto de entrada
    events:
      - http:
          path: /${self:service}/{proxy+}  # Captura todas las rutas
          method: ANY                       # GET, POST, PUT, DELETE

custom:
  serverless-offline:
    httpPort: 4001                # Puerto para desarrollo local
```

#### ¿Por qué usamos Serverless?

**Para desarrollo local:**
- `serverless-offline` simula AWS Lambda en tu máquina
- Permite probar sin deployar a AWS
- Express app corre como si fuera una Lambda function

**Cuando ejecutas `npm run dev`:**
```bash
npm run build && serverless offline start
```

1. Compila TypeScript → JavaScript (`dist/handler.js`)
2. Levanta servidor en `http://localhost:4001`
3. Simula AWS Lambda environment
4. Ejecuta Express app dentro del handler

#### Diferencia con Express Tradicional

| Express Normal | Express + Serverless |
|----------------|---------------------|
| `app.listen(4001)` | `serverlessExpress({ app })` |
| Servidor siempre corriendo | Función ejecutada bajo demanda |
| Despliegas a EC2/Heroku | Despliegas a AWS Lambda |
| Recursos fijos | Escala automático |

#### Patrón del Handler

```typescript
// backend-service/src/handler.ts
import serverlessExpress from '@codegenie/serverless-express'
import app from './app'

let serverlessExpressInstance

async function setup() {
  // Se ejecuta una vez en "cold start"
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance
}

export const handler = async (event, context) => {
  // Reutiliza instancia en "warm starts" (optimización)
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup()
  }
  return serverlessExpressInstance(event, context)
}
```

**Ventajas que demuestras:**
- ✅ Conoces arquitectura serverless moderna
- ✅ Código listo para cloud (AWS Lambda)
- ✅ Patrón de singleton para optimización
- ✅ Funciona igual en local que en producción

---

### 2. Server Actions (Next.js 14)

#### ¿Qué son Server Actions?

Server Actions son **funciones que se ejecutan en el servidor** pero se pueden llamar directamente desde componentes cliente, sin necesidad de crear endpoints API manualmente.

#### Implementación en el Proyecto

```typescript
// frontend/src/app/actions/form.ts
'use server'  // 🔥 Marca esta función como Server Action

import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  motivation: z.string().max(1000).optional(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

export async function submitResponse(prevState, formData) {
  // 1. Validación con Zod
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
    motivation: formData.get('motivation'),
    favorite_language: formData.get('favorite_language')
  })
  
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }
  
  // 2. Llamada al backend API
  const response = await fetch(`${API_URL}/api/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedFields.data)
  })
  
  // 3. Manejo de respuesta
  if (response.status === 409) {
    return { errors: { email: ['Este email ya ha respondido'] } }
  }
  
  return { success: true }
}
```

#### Uso en Componente Cliente

```typescript
// frontend/src/app/form/page.tsx
'use client'
import { useActionState } from 'react'
import { submitResponse } from '../actions/form'

export default function FormPage() {
  const [state, formAction, pending] = useActionState(submitResponse, {})
  
  return (
    <form action={formAction}>
      {/* Campos del formulario */}
      <button disabled={pending}>
        {pending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
```

#### Ventajas de Server Actions

| Característica | Valor |
|----------------|-------|
| **Menor código boilerplate** | No necesitas crear endpoints manualmente |
| **Validación automática** | Se ejecuta en servidor antes de procesamiento |
| **Estado de carga integrado** | `pending` automático sin `useState` |
| **Mejor SEO** | Funciona sin JavaScript del cliente |
| **Type-safe** | TypeScript end-to-end |
| **Progressive enhancement** | Formulario funciona incluso sin JS |

---

### 3. PostgreSQL Pool Pattern

#### ¿Qué es un Connection Pool?

Un **pool de conexiones** es un conjunto de conexiones a la base de datos que se **reutilizan** en lugar de crear y cerrar conexiones en cada petición.

#### Problema sin Pool

```typescript
// ❌ MAL: Crea nueva conexión en cada request
async function getResponses() {
  const client = new Client({ connectionString: DB_URL })
  await client.connect()        // Lento (TCP handshake, auth)
  const result = await client.query('SELECT * FROM responses')
  await client.end()            // Cierra conexión
  return result
}
```

**Problemas:**
- 🐌 Latencia alta (100-200ms por conexión)
- 💥 Sobrecarga de servidor con muchos requests
- 🔴 Límite de conexiones concurrentes alcanzado

#### Solución: Pool

```typescript
// ✅ BIEN: Reutiliza conexiones del pool
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Máximo 20 conexiones
  idleTimeoutMillis: 30000,   // Mantiene conexión idle por 30s
  connectionTimeoutMillis: 2000
})

export async function query(text, params) {
  // Obtiene conexión del pool (instantáneo si hay disponible)
  return pool.query(text, params)
  // Pool automáticamente libera la conexión
}
```

#### Implementación en el Proyecto

```typescript
// backend-service/src/services/database.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000
})

// Singleton: solo se crea una instancia
export async function query<T>(text: string, params?: any[]) {
  const start = Date.now()
  const result = await pool.query<T>(text, params)
  const duration = Date.now() - start
  
  console.log('Query ejecutado:', { text, duration, rows: result.rowCount })
  return result
}
```

#### Flujo de una Petición

```
Request → Controller → Repository → query()
                                        ↓
                                   Pool.query()
                                        ↓
                          ¿Conexión disponible en pool?
                          ├─ Sí → Usa conexión existente (1ms)
                          └─ No → Crea nueva conexión (100ms)
                                        ↓
                               Ejecuta SQL en PostgreSQL
                                        ↓
                          Libera conexión de vuelta al pool
                                        ↓
                                    Response
```

#### Ventajas del Pool

- ⚡ **Performance**: Reutiliza conexiones (1-2ms vs 100-200ms)
- 🔄 **Escalabilidad**: Gestiona múltiples requests concurrentes
- 🛡️ **Resiliencia**: Reconecta automáticamente si conexión falla
- 📊 **Monitoreo**: Pool expone métricas (`pool.totalCount`, `pool.idleCount`)

---

### 4. Repository Pattern

#### ¿Qué es el Repository Pattern?

Es un **patrón de diseño** que separa la lógica de acceso a datos del resto de la aplicación.

#### Estructura en el Proyecto

```
Controller → Repository → Database
   ↓            ↓           ↓
Business     SQL Queries  PostgreSQL
 Logic      Abstraction    Connection
```

#### Implementación

```typescript
// backend-service/src/repositories/responseRepository.ts
import { query } from '../services/database'

export const responseRepository = {
  // Crear nueva respuesta
  async create(data) {
    const sql = `
      INSERT INTO responses (email, motivation, favorite_language) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `
    const result = await query(sql, [data.email, data.motivation, data.favorite_language])
    return result.rows[0]
  },
  
  // Verificar si email existe
  async emailExists(email) {
    const sql = `SELECT EXISTS(SELECT 1 FROM responses WHERE email = $1)`
    const result = await query(sql, [email])
    return result.rows[0].exists
  },
  
  // Obtener últimas 5 respuestas
  async getRecent(limit = 5) {
    const sql = `
      SELECT email, submitted_at 
      FROM responses 
      ORDER BY submitted_at DESC 
      LIMIT $1
    `
    const result = await query(sql, [limit])
    return result.rows
  },
  
  // Estadísticas por lenguaje
  async getLanguageStats() {
    const sql = `
      SELECT favorite_language as language, COUNT(*) as count 
      FROM responses 
      GROUP BY favorite_language 
      ORDER BY count DESC
    `
    const result = await query(sql)
    return result.rows
  }
}
```

#### Ventajas del Repository

| Beneficio | Descripción |
|-----------|-------------|
| **Separación de responsabilidades** | Controller no conoce SQL |
| **Reutilización** | Misma query usada en múltiples controllers |
| **Testing** | Fácil mockear el repository |
| **Mantenibilidad** | Cambios en BD solo afectan repository |
| **Prevención SQL Injection** | Queries parametrizadas centralizadas |

---

### 5. Validación con Zod

#### ¿Por qué Zod?

Zod es una librería de **validación de esquemas** con inferencia de tipos TypeScript.

#### Doble Validación en el Proyecto

**Frontend** (pre-validación):
```typescript
// frontend/src/app/actions/form.ts
const formSchema = z.object({
  email: z.string().email('Email inválido'),
  motivation: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

const result = formSchema.safeParse(data)
if (!result.success) {
  // Muestra errores al usuario
  return { errors: result.error.flatten().fieldErrors }
}
```

**Backend** (validación definitiva):
```typescript
// backend-service/src/validators/responseValidator.ts
export const createResponseSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  motivation: z.string().max(1000).optional().nullable(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

// Middleware de validación
export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)  // Lanza error si falla
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues })
      }
      next(error)
    }
  }
}
```

#### Uso en Rutas

```typescript
// backend-service/src/routes/responseRoutes.ts
import { validate } from '../middleware/validation'
import { createResponseSchema } from '../validators/responseValidator'

router.post(
  '/api/responses',
  validate(createResponseSchema),  // 🔥 Valida antes de controller
  responseController.createResponse
)
```

#### Beneficios de Doble Validación

- 🎯 **Frontend**: Feedback inmediato al usuario (UX)
- 🛡️ **Backend**: Seguridad (nunca confíes en cliente)
- 🔒 **Type-safety**: TypeScript infiere tipos automáticamente
- 🧹 **Sanitización**: Transforma datos (lowercase, trim)

---

### 6. Modal Interactivo en Dashboard

#### Implementación

```typescript
// frontend/src/components/UserModal.tsx
export default function UserModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold">{user.email}</h3>
        <p className="text-gray-600 mt-4">
          {user.motivation || 'Sin motivación proporcionada'}
        </p>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-purple-600 text-white">
          Cerrar
        </button>
      </div>
    </div>
  )
}
```

#### Uso en Dashboard

```typescript
// frontend/src/app/dashboard/page.tsx
const [selectedUser, setSelectedUser] = useState(null)

<div onClick={() => setSelectedUser(user)} className="cursor-pointer">
  {user.email}
</div>

{selectedUser && (
  <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
)}
```

#### Características

- ✅ **Backdrop con overlay** semi-transparente
- ✅ **Centrado responsive** con Flexbox
- ✅ **Z-index elevado** para estar sobre todo
- ✅ **Click en usuario** dispara modal
- ✅ **Muestra motivación completa** sin límite de caracteres

---

### 7. Prevención de Emails Duplicados

#### Constraint en Base de Datos

```sql
CREATE TABLE responses (
  email VARCHAR(255) NOT NULL UNIQUE  -- 🔒 UNIQUE evita duplicados
);
```

#### Manejo de Error PostgreSQL

```typescript
// backend-service/src/controllers/responseController.ts
export async function createResponse(req, res) {
  try {
    const response = await responseRepository.create(req.body)
    res.status(201).json(response)
  } catch (error) {
    // 🔥 Error 23505 = Unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Este email ya ha respondido el formulario'
      })
    }
    throw error
  }
}
```

#### Frontend: Mostrar Error 409

```typescript
// frontend/src/app/actions/form.ts
const response = await fetch(`${API_URL}/api/responses`, {...})

if (response.status === 409) {
  return { 
    errors: { 
      email: ['Este email ya ha respondido el formulario'] 
    } 
  }
}
```

#### Códigos HTTP Usados

| Código | Significado | Uso en el Proyecto |
|--------|-------------|-------------------|
| **201 Created** | Recurso creado exitosamente | Respuesta enviada |
| **409 Conflict** | Conflicto con estado actual | Email duplicado |
| **400 Bad Request** | Validación fallida | Datos inválidos |
| **404 Not Found** | Recurso no encontrado | Email no existe |

---

## � Documentación del Proyecto

### Archivos de Documentación

Toda la documentación técnica está organizada en el directorio `docs/`:

| Archivo | Propósito | Tamaño | Para Qué Sirve |
|---------|-----------|--------|----------------|
| [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) | Documentación técnica completa | ~1,080 líneas | Arquitectura detallada, troubleshooting avanzado, diagramas |
| [docs/GUIA_IMPLEMENTACION.md](docs/GUIA_IMPLEMENTACION.md) | Guía de implementación con Context7 | ~1,350 líneas | Patrones de código, ejemplos prácticos de Next.js, PostgreSQL, Zod |
| [docs/PLAN_IMPLEMENTACION.md](docs/PLAN_IMPLEMENTACION.md) | Plan de desarrollo por fases | ~1,270 líneas | Roadmap de implementación, checklist de verificación |
| [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) | Configuración de Docker y PostgreSQL | ~170 líneas | Setup de contenedores, comandos Docker útiles |

**Ver**: [Índice completo de documentación](docs/INDEX.md)

---

### Herramientas de Desarrollo Utilizadas

#### Context7 - Documentación Oficial en Tiempo Real

Este proyecto utilizó **Context7** para acceder a documentación actualizada y oficial de las librerías:

**¿Qué es Context7?**
- Sistema de consulta de documentación oficial de librerías
- Proporciona código actualizado según las últimas versiones
- Evita código obsoleto o deprecated

**Librerías Consultadas**:
```
/vercel/next.js              → Server Actions, useActionState, App Router
/brianc/node-postgres        → Pool pattern, parameterized queries
/colinhacks/zod              → safeParse, schema validation
/codegenieapp/serverless-express → Lambda handler patterns
/websites/v3_tailwindcss     → Responsive utilities, modal patterns
```

**Beneficios Obtenidos**:
- ✅ Código implementado según best practices oficiales
- ✅ Patrones modernos de Next.js 14 (Server Actions)
- ✅ Pool de PostgreSQL con configuración óptima
- ✅ Validación type-safe con Zod
- ✅ Serverless handler con singleton pattern

---

### GitHub Copilot Configuration

El proyecto incluye configuración personalizada para GitHub Copilot en `.github/`:

#### 1. `.github/copilot-instructions.md`
**Propósito**: Instrucciones específicas del proyecto para GitHub Copilot.

**Contenido**:
- Stack tecnológico del proyecto
- Requisitos exactos del formulario (2 preguntas + email)
- Especificaciones del dashboard (3 componentes)
- Patrones de código recomendados
- Convenciones de naming
- Validaciones requeridas

**Uso**: GitHub Copilot lee este archivo para dar sugerencias contextualizadas al proyecto.

---

#### 2. `.github/instructions/commit.instructions.md`
**Propósito**: Guía de Conventional Commits para el proyecto.

**Contenido**:
- Formato de commits (RFC 2119)
- Tipos de commit: `feat`, `fix`, `docs`, `chore`, etc.
- Scopes por área: `api`, `database`, `auth`, `components`
- Ejemplos de commits bien formados
- Workflow de commits agrupados por contexto
- Semantic Versioning mapping

**Uso**: Asegura consistencia en el historial de Git y permite:
- ✅ Generación automática de CHANGELOG
- ✅ Semantic versioning automático
- ✅ Commits organizados y descriptivos

**Ejemplo de commits generados**:
```bash
feat(frontend): implement analytics dashboard
docs(backend): update README with project-specific endpoints
chore(frontend): add zod dependency for form validation
```

---

#### 3. `.github/agents/Beast Mode.agent.md`
**Propósito**: Configuración de agente especializado para tareas complejas.

**Características**:
- Agente autónomo para tareas multi-paso
- Optimizado para investigación y búsqueda de código
- Ejecuta operaciones de forma independiente

**Cuándo se activa**: Para búsquedas complejas o implementaciones que requieren múltiples pasos.

---

## �🛠️ Comandos Útiles (Makefile)

> **El Makefile es el orquestador del proyecto**: Contiene todos los comandos necesarios para iniciar, detener, testear y administrar el sistema completo (Base de Datos + Backend + Frontend) de forma automatizada.

### Comandos Principales

```bash
make help          # Mostrar todos los comandos disponibles
make install       # Instalar todas las dependencias
make dev           # Iniciar TODO (DB + Backend + Frontend)
make clean         # Limpiar y resetear todo
```

### Base de Datos

```bash
make db-up         # Iniciar PostgreSQL
make db-down       # Detener PostgreSQL
make db-reset      # Resetear BD (elimina y recrea)
make db-psql       # Conectar con psql
make db-seed       # Ejecutar seed manualmente
make db-count      # Contar registros en responses
make db-logs       # Ver logs de PostgreSQL
```

### Backend

```bash
make backend-dev   # Iniciar backend en desarrollo
make backend-logs  # Ver logs del backend
make test-api      # Probar todos los endpoints
```

### Frontend

```bash
make frontend-dev  # Iniciar frontend en desarrollo
```

### Testing

```bash
make test-api      # Prueba automática de 7 endpoints
```

**Ejemplo de output**:
```
✓ Health check passed
✓ Create response passed
✓ Get count passed
✓ Get recent passed
✓ Get stats passed
✓ Get by email passed
✓ Check email passed

📊 Results: 7/7 tests passed
```

---

## 🔒 Seguridad

### Medidas Implementadas

1. **SQL Injection Prevention**
   - Uso de queries parametrizadas con `pg`
   - Ejemplo: `query('SELECT * FROM responses WHERE email = $1', [email])`

2. **Validación de Datos**
   - Zod schemas en backend y frontend
   - Validación de tipos y formatos
   - Sanitización automática

3. **CORS Configurado**
   - Solo permite requests desde `http://localhost:3000`
   - Configurable via variable de entorno `CORS_ORIGIN`

4. **Error Handling**
   - No expone stack traces en producción
   - Mensajes de error genéricos
   - Logging estructurado

5. **Constraints de Base de Datos**
   - UNIQUE constraint en email
   - CHECK constraint en favorite_language
   - Índices para optimizar consultas

### Variables de Entorno

⚠️ **NUNCA commitear archivos `.env`**

Archivos incluidos en `.gitignore`:
- `backend-service/.env`
- `frontend/.env.local`
- `.env`

---

## 🧪 Testing

### Pruebas Manuales

1. **Formulario - Email Único**
   ```bash
   # Intenta enviar el mismo email dos veces
   curl -X POST http://localhost:4001/dev/backend/api/responses \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","favorite_language":"JavaScript"}'
   
   # Segunda vez debe devolver error 409
   ```

2. **Dashboard - Actualización en Tiempo Real**
   - Abre el dashboard en una pestaña
   - Envía una nueva respuesta desde otra pestaña
   - Presiona "Actualizar" en el dashboard
   - Verifica que aparezca la nueva respuesta

3. **Modal de Motivación**
   - Ve al dashboard
   - Haz clic en cualquier email de "Respuestas Recientes"
   - Verifica que se abra el modal con la motivación

### Pruebas Automáticas con Makefile

```bash
make test-api
```

Ejecuta pruebas de los 7 endpoints:
1. Health check
2. Create response (POST)
3. Get count
4. Get recent
5. Get stats
6. Get by email
7. Check email exists

---

## 📊 Datos de Prueba

La base de datos incluye 9 registros de prueba (seed.sql):

| Email | Lenguaje | Motivación |
|-------|----------|------------|
| user1@example.com | JavaScript | Passionate about web... |
| user2@example.com | Python | Love data science... |
| user3@example.com | JavaScript | Frontend enthusiast... |
| user4@example.com | Java | Enterprise development... |
| user5@example.com | C# | .NET ecosystem... |
| user6@example.com | Otro | Learning multiple... |
| user7@example.com | Python | Backend and AI... |
| user8@example.com | JavaScript | Full stack developer... |
| alice@example.com | JavaScript | (NULL) |

---

## 🎨 UI/UX Características

### Diseño Responsive
- ✅ Mobile First (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

### Estados de UI
- ✅ Loading states (spinners)
- ✅ Error states (mensajes claros)
- ✅ Empty states (sin datos)
- ✅ Success feedback (toasts/alerts)

### Accesibilidad
- ✅ Semántica HTML correcta
- ✅ Contraste de colores WCAG AA
- ✅ Navegación por teclado
- ✅ Labels asociados a inputs

---

## 🐛 Troubleshooting

### Problema: Backend no inicia

**Error**: `Database connection failed`

**Solución**:
```bash
# Verificar que PostgreSQL está corriendo
make db-ps

# Si no está corriendo, iniciarlo
make db-up

# Verificar conexión
make db-psql
```

---

### Problema: Frontend no conecta con Backend

**Error**: `Failed to fetch` o `Network error`

**Solución**:
```bash
# 1. Verificar que backend esté corriendo
curl http://localhost:4001/dev/backend/health

# 2. Verificar .env.local del frontend
cat frontend/.env.local
# Debe contener: NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend

# 3. Reiniciar frontend
cd frontend
npm run dev
```

---

### Problema: Error 409 al enviar formulario

**Error**: `Este email ya ha respondido el formulario`

**Causa**: El email ya existe en la base de datos

**Solución**:
```bash
# Opción 1: Usar otro email diferente

# Opción 2: Eliminar el registro existente
make db-psql
# Dentro de psql:
DELETE FROM responses WHERE email = 'tu-email@example.com';
\q
```

---

### Problema: Puerto ocupado

**Error**: `Port 4001 already in use`

**Solución**:
```bash
# Liberar el puerto
lsof -ti:4001 | xargs kill -9

# O usar el comando de Makefile
make stop
```

---

## 📚 Recursos Adicionales

### Documentación Completa
Ver [DOCUMENTATION.md](./DOCUMENTATION.md) para:
- Detalles técnicos completos
- Ejemplos de código
- Arquitectura detallada
- Guías de desarrollo

### Tecnologías Utilizadas
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Serverless Framework](https://www.serverless.com/framework/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod](https://zod.dev/)

---

## ✅ Checklist de Implementación

### Funcionalidad
- [x] Formulario funciona correctamente
- [x] Validaciones implementadas según especificaciones
- [x] No se permiten respuestas duplicadas por email (409)
- [x] Dashboard muestra toda la información requerida
- [x] Interacción entre componentes funciona (modal)

### Código y Arquitectura
- [x] Código limpio y bien estructurado
- [x] Separación correcta frontend/backend
- [x] Manejo adecuado de errores
- [x] Uso correcto de tecnologías proporcionadas
- [x] TypeScript configurado y usado correctamente

### Base de Datos
- [x] Diseño apropiado (tabla responses)
- [x] Queries eficientes (índices optimizados)
- [x] Integridad de datos garantizada (constraints)

### Extras
- [x] Interfaz de usuario atractiva (Tailwind CSS)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Manejo de estados de carga (spinners)
- [x] Documentación completa (README + DOCUMENTATION)
- [x] Scripts de automatización (Makefile)
- [x] Datos de prueba (seed.sql)
- [x] Health check endpoint

---

## 👨‍💻 Autor

**Nombre**: Victor Lara Gilles  
**Email**: Gilles.604@gmail.com 
**GitHub**: Vic-Lara-Gilles

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para Adaín.

---

## 🎉 ¡Gracias!

Si tienes preguntas o sugerencias sobre este proyecto, no dudes en contactarme.

**Made with ❤️ using Next.js, Express, PostgreSQL and TypeScript**
