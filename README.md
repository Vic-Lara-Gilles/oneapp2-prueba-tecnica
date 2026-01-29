# Prueba Técnica - Desarrollador Full Stack

## 📋 Descripción General

Esta prueba técnica evalúa habilidades para desarrollar una aplicación full stack completa que incluye frontend, backend y base de datos. El proyecto consiste en un sistema de formularios con dashboard para visualizar las respuestas.

## 🎯 Objetivo

Crear un sistema completo que permita a los usuarios responder un cuestionario y visualizar estadísticas de las respuestas a través de un dashboard administrativo.

---

## 📑 Índice

- [Estado de Implementación](#-estado-de-implementación)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requerimientos Funcionales](#-requerimientos-funcionales)
  - [Formulario de Respuestas](#1-formulario-de-respuestas)
  - [Dashboard de Estadísticas](#2-dashboard-de-estadísticas)
- [Arquitectura Técnica](#️-arquitectura-técnica)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Base de Datos](#️-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Criterios de Evaluación](#-criterios-de-evaluación-cumplidos)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Solución de Problemas](#-solución-de-problemas)
- [Documentación Adicional](#-documentación-adicional)
- [Preguntas Frecuentes](#-preguntas-frecuentes)

---

## ✅ Estado de Implementación

| Requerimiento | Estado | Descripción |
|---------------|--------|-------------|
| Formulario de respuestas | ✅ Completado | Validación en tiempo real con Zod |
| Prevención de duplicados | ✅ Completado | Error 409 si email ya existe |
| Dashboard con 3 componentes | ✅ Completado | Contador, usuarios recientes, estadísticas |
| Modal interactivo | ✅ Completado | Click en usuario muestra motivación |
| API RESTful | ✅ Completado | 5 endpoints requeridos + 2 adicionales |
| Base de datos | ✅ Completado | PostgreSQL con índices optimizados |
| Interfaz responsive | ✅ Completado | Tailwind CSS + diseño adaptativo |

---

## 🎯 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14.2.30 (App Router)
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.0
- **Validación**: Zod 4.3.6
- **Lenguaje**: TypeScript 5

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.19.2
- **Serverless**: Serverless Framework + serverless-offline
- **Database Client**: node-postgres (pg) 8.17.2
- **Validación**: Zod 4.3.6
- **Lenguaje**: TypeScript 5.8.2

### Base de Datos
- **Motor**: PostgreSQL 14 (Alpine)
- **Orquestación**: Docker Compose
- **Puerto**: 5432

---

## 📝 Requerimientos Funcionales

### 1. Formulario de Respuestas

El formulario contiene **exactamente** las siguientes preguntas según especificaciones:

#### Pregunta 1: Texto Libre (OPCIONAL)
- **Pregunta**: "¿Qué te motivó a aplicar a esta posición?"
- **Tipo**: Campo de texto libre (textarea)
- **Validación**: 
  - Opcional (puede quedar vacío)
  - Máximo 1000 caracteres

#### Pregunta 2: Selección Múltiple (OBLIGATORIA)
- **Pregunta**: "¿Cuál es tu lenguaje de programación favorito?"
- **Tipo**: Selección múltiple (select)
- **Opciones**:
  - JavaScript
  - Python
  - Java
  - C#
  - Otro
- **Validación**: Obligatoria (debe seleccionar una opción)

#### Campo de Identificación (OBLIGATORIO)
- **Campo**: Correo electrónico
- **Validación**:
  - Obligatorio
  - Formato de email válido
  - ⚠️ **CRÍTICO**: Un usuario NO puede enviar más de una respuesta (validación por email)
  - Retorna Error 409 si el email ya existe

### 2. Dashboard de Estadísticas

#### Componente 1: Contador de Respuestas
- Muestra el número total de respuestas almacenadas en la base de datos
- Actualizable con botón de refresh

#### Componente 2: Últimos Usuarios
- Lista de los últimos 5 usuarios que han respondido el formulario
- Muestra: email y fecha/hora de respuesta
- **Funcionalidad adicional**: Al hacer clic en cualquier usuario, se abre un modal mostrando su respuesta a la pregunta de motivación

#### Componente 3: Estadísticas de Selección Múltiple
- Gráfico de barras horizontal que muestra cuántas veces se ha seleccionado cada opción
- Incluye porcentaje del total
- Ordenado por popularidad

**Ejemplo de visualización:**
```
JavaScript: 15 respuestas (45%) ████████████████████
Python:      8 respuestas (24%) ███████████
Java:        3 respuestas  (9%) ████
C#:          2 respuestas  (6%) ███
Otro:        1 respuesta   (3%) █
```

---

## 🏗️ Arquitectura Técnica

### Frontend
- **Tecnología**: Next.js 14 (App Router)
- **Ubicación**: Carpeta `frontend/`
- **Funcionalidades**:
  - Página del formulario (`/form`)
  - Página del dashboard (`/dashboard`)
  - Navegación entre ambas páginas
  - Validaciones en tiempo real
  - Comunicación con el backend via API
  - Server Actions para envío de formulario

### Backend
- **Tecnología**: Node.js con Express
- **Ubicación**: Carpeta `backend-service/`
- **Endpoints implementados**:

```
POST /api/responses          # Enviar nueva respuesta
GET  /api/responses/count    # Obtener total de respuestas
GET  /api/responses/recent   # Obtener últimas 5 respuestas
GET  /api/responses/stats    # Estadísticas de selección múltiple
GET  /api/responses/:email   # Obtener respuesta específica por email
GET  /api/responses/check/:email  # Verificar si email existe
GET  /health                 # Health check del servidor
```

### Base de Datos
- **Tecnología**: PostgreSQL 14
- **Ubicación**: Carpeta `database/`
- **Esquema**: Tabla `responses` con constraint UNIQUE en email

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

### 2️⃣ Configuración Completa (Un Solo Comando)

**🎯 Método Rápido (Recomendado)**
```bash
make start
```

Este comando ejecuta automáticamente:
- ✅ Instalación de dependencias (backend + frontend)
- ✅ Creación de archivos `.env` desde `.env.example`
- ✅ Inicio de PostgreSQL en Docker
- ✅ Espera a que la base de datos esté lista

**Método Manual (Si no usas Makefile)**
```bash
# 1. Instalar dependencias
cd backend-service && npm install
cd ../frontend && npm install
Variables de Entorno (Opcional - `make start` las crea automáticamente)

Si ejecutaste `make start`, los archivos `.env` ya están configurados. Si prefieres configurarlos manualmente:

**Backend** - `backend-service/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prueba_tecnica
NODE_ENV=development
PORT=4001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** - `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
```

> **💡 Nota**: `make start` copia automáticamente `.env.example` → `.env` si no existen.
>
> **🔒 Seguridad**: Los archivos `.env` están en `.gitignore` y NUNCA deben subirse al repositorio.

### 4️⃣ Base de Datos (Automática con `make start`)

Si ejecutaste `make start`, PostgreSQL ya está corriendo. Para gestión manual:

```bash
make db-up      # Iniciar PostgreSQL
make db-down    # Detener PostgreSQL
make db-reset   # Resetear base de datos
make db-psql    # Conectar a PostgreSQL
```

La base de datos se inicializa automáticamente con:
- ✅ Tabla `responses` creada
- ✅ Índices optimizados
- ✅ Datos de prueba (5 registros 

La base de datos se inicializa automáticamente con:
- ✅ Tabla `responses` creada
- ✅ Índices optimizados
- ✅ Datos de prueba (seed)

### 5️⃣ Iniciar los Servicios

**🚀 Inicio Rápido (Recomendado)**

```bash
# 1. Preparar todo (instalar deps, configurar .env, iniciar DB)
make start

# 2. En terminal 1 - Iniciar Backend
make backend

# 3. En terminal 2 - Iniciar Frontend
make frontend
```

**Opción Manual (Sin Makefile)**
```bash
# Terminal 1 - Base de datos
docker compose up -d postgres

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

## 🗄️ Base de Datos


### 7️⃣ Comandos Útiles

```bash
make help       # Ver todos los comandos disponibles
make status     # Ver estado de todos los servicios
make stop       # Detener todos los servicios
make clean      # Limpiar node_modules y cache
make db-reset   # Resetear base de datos
```
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

### 4. Obtener Últimas 5 Respuestas

```http
GET /api/responses/recent
```

**Respuesta** (200 OK):
```json
[
  {
    "id": 10,
    "email": "usuario@example.com",
    "motivation": "Me apasiona...",
    "favorite_language": "JavaScript",
    "submitted_at": "2026-01-28T22:30:15.123Z"
  }
]
```

### 5. Obtener Estadísticas de Lenguajes

```http
GET /api/responses/stats
```

**Respuesta** (200 OK):
```json
[
  { "favorite_language": "JavaScript", "count": "15" },
  { "favorite_language": "Python", "count": "8" },
  { "favorite_language": "Java", "count": "3" },
  { "favorite_language": "C#", "count": "2" },
  { "favorite_language": "Otro", "count": "1" }
]
```

### 6. Obtener Respuesta por Email

```http
GET /api/responses/:email
```

**Respuesta** (200 OK):
```json
{
  "id": 10,
  "email": "usuario@example.com",
  "motivation": "Me apasiona...",
  "favorite_language": "JavaScript",
  "submitted_at": "2026-01-28T22:30:15.123Z"
}
```

**Error: No Encontrado** (404 Not Found):
```json
{
  "error": "Respuesta no encontrada"
}
```

---

## 📁 Estructura del Proyecto

```
oneapp2-prueba-tecnica/
├── frontend/                     # Frontend Next.js 14
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Página principal
│   │   │   ├── form/             # Página del formulario
│   │   │   │   ├── page.tsx
│   │   │   │   ├── actions.ts    # Server Actions
│   │   │   │   └── _components/  # Componentes del formulario
│   │   │   └── dashboard/        # Página del dashboard
│   │   │       ├── page.tsx
│   │   │       └── _components/  # Componentes del dashboard
│   │   ├── components/ui/        # Componentes UI reutilizables
│   │   └── services/             # Cliente API
│   └── package.json
│
├── backend-service/              # Backend Express + Serverless
│   ├── src/
│   │   ├── handler.ts            # Entry point Serverless
│   │   ├── app.ts                # Configuración Express
│   │   ├── routes/               # Rutas API
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── repositories/         # Queries SQL
│   │   ├── validators/           # Schemas Zod
│   │   └── middleware/           # Validación y errores
│   └── package.json
│
├── database/                     # Scripts de base de datos
│   ├── schema.sql                # Definición de tabla
│   └── seed.sql                  # Datos de prueba
│
├── docker-compose.yml            # PostgreSQL container
├── Makefile                      # Comandos de automatización
└── README.md                     # Este archivo
```

---

## ✅ Criterios de Evaluación Cumplidos

### Funcionalidad
- ✅ El formulario funciona correctamente
- ✅ Las validaciones se implementan según especificaciones
- ✅ No se permiten respuestas duplicadas por email
- ✅ El dashboard muestra toda la información requerida
- ✅ La interacción entre componentes funciona (modal de motivación)

### Código y Arquitectura
- ✅ Código limpio y bien estructurado
- ✅ Separación correcta entre frontend y backend
- ✅ Manejo adecuado de errores (error boundaries)
- ✅ Uso correcto de las tecnologías (Next.js 14, Express, PostgreSQL)

### Base de Datos
- ✅ Diseño apropiado con constraint UNIQUE en email
- ✅ Queries eficientes con índices
- ✅ Integridad de datos garantizada (CHECK constraint)

### Extras Implementados
- ✅ Interfaz de usuario atractiva con gradientes
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Manejo de estados de carga (loading skeletons)
- ✅ Documentación completa
- ✅ Componentes UI reutilizables (Button, Card, ErrorContainer)
- ✅ Server Actions de Next.js 14
- ✅ Arquitectura Serverless preparada para AWS Lambda

---

## 📸 Capturas de Pantalla

### Página Principal
![Home](screenshots/01-home-page.png)

### Formulario
![Formulario vacío](screenshots/02-form-empty.png)

![Validación de formulario](screenshots/03-form-validation.png)

![Formulario enviado](screenshots/04-form-success.png)

![Email duplicado](screenshots/05-form-duplicate-email.png)

### Dashboard
![Dashboard](screenshots/06-dashboard.png)

![Modal de motivación](screenshots/07-modal-open.png)

### Backend y Base de Datos
![Datos en PostgreSQL](screenshots/08-database-data.png)

![API Health Check](screenshots/09-api-health.png)

![Backend corriendo](screenshots/10-backend-running.png)

---

## 🐛 Solución de Problemas

### Error de conexión con el backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:4001/dev/backend/health

# Verificar PostgreSQL
docker ps | grep postgres
```

### Error: "Port already in use"
```bash
# Liberar puerto 3000
lsof -ti:3000 | xargs kill -9

# Liberar puerto 4001
lsof -ti:4001 | xargs kill -9
```

### Error: "Este email ya ha respondido"
Este es el comportamiento esperado. Cada email solo puede enviar el formulario una vez.

---

## 📚 Documentación Adicional

| Archivo | Descripción |
|---------|-------------|
| [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) | Documentación técnica completa |
| [docs/GUIA_IMPLEMENTACION.md](docs/GUIA_IMPLEMENTACION.md) | Guía con patrones Context7 |
| [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) | Configuración de Docker |
| [frontend/README.md](frontend/README.md) | Documentación del frontend |
| [backend-service/README.md](backend-service/README.md) | Documentación del backend |

---

## ❓ Preguntas Frecuentes

**Q: ¿Puedo usar librerías adicionales?**  
A: Sí, se agregaron Zod para validación y componentes UI personalizados.

**Q: ¿Qué pasa si no termino en el tiempo estimado?**  
A: El proyecto está 100% completado con todos los requerimientos.

**Q: ¿Necesito implementar autenticación?**  
A: No, solo validación por email para evitar respuestas duplicadas (implementado).

---

**Desarrollado con Next.js 14, React 18, Express, PostgreSQL y TypeScript**
