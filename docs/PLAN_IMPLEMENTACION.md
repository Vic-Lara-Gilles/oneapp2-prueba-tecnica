# 📋 PLAN DE IMPLEMENTACIÓN - Full Stack Form & Dashboard

> **Proyecto**: Prueba Técnica Desarrollador Full Stack  
> **Fecha**: Enero 28, 2026  
> **Nota**: Este plan incluye patrones basados en **Context7** (mejores prácticas de Next.js, node-postgres, Zod, Tailwind CSS)
> 
> 📘 **Documentación Detallada**: Ver [GUIA_IMPLEMENTACION.md](./GUIA_IMPLEMENTACION.md) para ejemplos completos de código y patrones avanzados

---

## 🎯 Resumen del Proyecto

| Aspecto | Detalle |
|---------|---------|
| **Frontend** | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| **Backend** | Node.js 18 + Express + Serverless Framework |
| **Base de datos** | PostgreSQL 14+ |
| **Puerto Frontend** | http://localhost:3000 |
| **Puerto Backend** | http://localhost:4001 |

### Objetivo
Crear un sistema completo que permita a los usuarios responder un cuestionario y visualizar estadísticas de las respuestas a través de un dashboard administrativo.

---

## 📊 FASES DE IMPLEMENTACIÓN

### **FASE 1: Configuración de Base de Datos PostgreSQL**

#### Tareas:

1. **Crear carpeta de database scripts**
   ```
   database/
   ├── schema.sql       # Esquema de tabla
   └── seed.sql         # Datos de prueba
   ```

2. **Crear schema PostgreSQL**
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
   
   CREATE INDEX idx_responses_email ON responses(email);
   CREATE INDEX idx_responses_submitted_at ON responses(submitted_at DESC);
   ```

3. **Configurar conexión** - Archivo `.env` con `DATABASE_URL`

4. **Configurar Pool de conexiones optimizado** (ver Context7: node-postgres)
   ```typescript
   // backend-service/src/services/database.ts
   import { Pool } from 'pg'
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
     max: 20,                      // Máximo de conexiones
     idleTimeoutMillis: 30000,     // Cerrar inactivas tras 30s
     connectionTimeoutMillis: 2000 // Error si no conecta en 2s
   })
   ```
   > 📘 **Referencia**: Ver [GUIA_IMPLEMENTACION.md - Sección 2.1](./GUIA_IMPLEMENTACION.md#21-configuración-del-pool-de-conexiones) para configuración completa

#### Entregables:
- [ ] Carpeta `database/` creada
- [ ] Archivo `schema.sql` con estructura de tabla
- [ ] Archivo `seed.sql` con datos de prueba
- [ ] Base de datos PostgreSQL configurada y funcionando
- [ ] Pool de conexiones con manejo de errores implementado

---

### **FASE 2: Estructura del Backend**

#### Nueva estructura de archivos:
```
backend-service/src/
├── handler.ts              # Entry point (modificar)
├── routes/
│   └── responses.ts        # Rutas de API
├── controllers/
│   └── responseController.ts
├── services/
│   └── database.ts         # Pool de PostgreSQL
├── middleware/
│   ├── cors.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── models/
│   └── Response.ts         # Interfaces TypeScript
└── utils/
    └── constants.ts
```

#### Dependencias a instalar:
```bash
cd backend-service
npm install pg dotenv cors
npm install -D @types/pg @types/cors
```

#### Patrón de conexión PostgreSQL:
```typescript
// services/database.ts - Ver GUIA_IMPLEMENTACION.md Sección 2.1
import { Pool, QueryResult } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000
})

pool.on('error', (err, client) => {
  console.error('Error inesperado en cliente inactivo:', err)
})

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const result = await pool.query<T>(text, params)
  return result
}

export default pool
```

#### Patrón serverless-express (Context7):
```typescript
// handler.ts - Ver GUIA_IMPLEMENTACION.md Sección 3.1
import serverlessExpress from '@codegenie/serverless-express'
import app from './app'

let serverlessExpressInstance: ReturnType<typeof serverlessExpress>

async function setup() {
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance
}

export const handler = async (event: any, context: any) => {
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup()
  }
  return serverlessExpressInstance(event, context)
}
```
> 📘 **Referencia**: [GUIA_IMPLEMENTACION.md - Sección 3](./GUIA_IMPLEMENTACION.md#3-express--serverless-framework)

#### Entregables:
- [ ] Estructura de carpetas creada
- [ ] Dependencias instaladas
- [ ] Servicio de base de datos configurado
- [ ] Middleware de CORS y error handling

---

### **FASE 3: Implementar API Endpoints**

#### Endpoints requeridos:

| Método | Endpoint | Descripción | Prioridad |
|--------|----------|-------------|-----------|
| `POST` | `/api/responses` | Enviar nueva respuesta | 🔴 Alta |
| `GET` | `/api/responses/count` | Total de respuestas | 🔴 Alta |
| `GET` | `/api/responses/recent` | Últimas 5 respuestas | 🔴 Alta |
| `GET` | `/api/responses/stats` | Estadísticas por lenguaje | 🔴 Alta |
| `GET` | `/api/responses/:email` | Respuesta por email | 🟡 Media |

#### Repository Pattern (Context7: node-postgres queries parametrizadas):

```typescript
// repositories/responseRepository.ts
import { query } from '../services/database'

interface CreateResponseDTO {
  email: string
  motivation?: string
  favorite_language: string
}

interface ResponseEntity {
  id: number
  email: string
  motivation: string | null
  favorite_language: string
  submitted_at: Date
}

export const responseRepository = {
  // Crear nueva respuesta
  async create(data: CreateResponseDTO): Promise<ResponseEntity> {
    const sql = `
      INSERT INTO responses (email, motivation, favorite_language)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const values = [data.email, data.motivation || null, data.favorite_language]
    const result = await query<ResponseEntity>(sql, values)
    return result.rows[0]
  },

  // Verificar si existe email
  async emailExists(email: string): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT 1 FROM responses WHERE email = $1) as exists`
    const result = await query<{ exists: boolean }>(sql, [email])
    return result.rows[0].exists
  },

  // Obtener conteo total
  async getCount(): Promise<number> {
    const sql = `SELECT COUNT(*) as total FROM responses`
    const result = await query<{ total: string }>(sql)
    return parseInt(result.rows[0].total, 10)
  },

  // Obtener respuestas recientes
  async getRecent(limit: number = 5): Promise<ResponseEntity[]> {
    const sql = `
      SELECT id, email, motivation, favorite_language, submitted_at
      FROM responses
      ORDER BY submitted_at DESC
      LIMIT $1
    `
    const result = await query<ResponseEntity>(sql, [limit])
    return result.rows
  },

  // Obtener estadísticas de lenguajes
  async getLanguageStats() {
    const sql = `
      SELECT favorite_language, COUNT(*) as count
      FROM responses
      GROUP BY favorite_language
      ORDER BY count DESC
    `
    const result = await query(sql)
    return result.rows
  },

  // Obtener respuesta por email
  async findByEmail(email: string): Promise<ResponseEntity | null> {
    const sql = `SELECT * FROM responses WHERE email = $1`
    const result = await query<ResponseEntity>(sql, [email])
    return result.rows[0] || null
  }
}
```

#### Validación con Zod (Context7):
```typescript
// validators/responseValidator.ts
import { z } from 'zod'

export const createResponseSchema = z.object({
  email: z.string()
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Formato de email inválido' })
    .toLowerCase()
    .trim(),
  motivation: z.string()
    .max(1000, { message: 'Máximo 1000 caracteres' })
    .optional()
    .nullable(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'], {
    errorMap: () => ({ message: 'Selecciona un lenguaje válido' })
  })
})

export type CreateResponseDTO = z.infer<typeof createResponseSchema>
```
> 📘 **Referencia**: [GUIA_IMPLEMENTACION.md - Sección 2.3 y 4](./GUIA_IMPLEMENTACION.md#23-queries-parametrizadas-seguridad)

#### Entregables:
- [ ] Todos los endpoints implementados
- [ ] Validación de datos en cada endpoint
- [ ] Manejo de errores (duplicados, not found, etc.)
- [ ] Pruebas con curl/Postman exitosas

---

### **FASE 4: Estructura del Frontend**

#### Nueva estructura de archivos:
```
frontend/src/
├── app/
│   ├── page.tsx              # Landing page (modificar)
│   ├── layout.tsx            # Layout (modificar metadata)
│   ├── form/
│   │   └── page.tsx          # Página del formulario
│   └── dashboard/
│       └── page.tsx          # Página del dashboard
├── components/
│   ├── Navigation.tsx        # Navegación
│   ├── FormComponent.tsx     # Formulario principal
│   ├── ResponseCounter.tsx   # Contador total
│   ├── RecentUsersList.tsx   # Lista últimos 5 usuarios
│   ├── LanguageStats.tsx     # Estadísticas
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── services/
│   └── api.ts                # Cliente de API
├── types/
│   └── index.ts              # Interfaces TypeScript
└── lib/
    └── utils.ts              # Utilidades
```

#### Configurar `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
```

#### Servicio de API:
```typescript
// services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  submitResponse: async (data: FormData) => {
    const response = await fetch(`${API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  
  getCount: async () => {
    const response = await fetch(`${API_URL}/api/responses/count`);
    return response.json();
  },
  
  getRecent: async () => {
    const response = await fetch(`${API_URL}/api/responses/recent`);
    return response.json();
  },
  
  getStats: async () => {
    const response = await fetch(`${API_URL}/api/responses/stats`);
    return response.json();
  },
  
  getByEmail: async (email: string) => {
    const response = await fetch(`${API_URL}/api/responses/${email}`);
    return response.json();
  }
};
```

#### Entregables:
- [ ] Estructura de carpetas creada
- [ ] Servicio de API implementado
- [ ] Tipos TypeScript definidos
- [ ] Variables de entorno configuradas

---

### **FASE 5: Implementar Formulario**

#### Campos del formulario:

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| Email | `input[email]` | Formato válido, único | ✅ Sí |
| Motivación | `textarea` | Max 1000 caracteres | ❌ No |
| Lenguaje Favorito | `radio/select` | Una opción seleccionada | ✅ Sí |

#### Opciones de Lenguaje:
- JavaScript
- Python
- Java
- C#
- Otro

#### Patrón useActionState + Server Actions (Context7: Next.js 14):
```tsx
// components/FormComponent.tsx
'use client'
import { useActionState } from 'react'
import { submitResponse } from '@/app/actions/form'

const initialState = {
  message: '',
  errors: {} as Record<string, string[]>,
  success: false
}

export function FormComponent() {
  const [state, formAction, pending] = useActionState(submitResponse, initialState)

  return (
    <form action={formAction}>
      {/* Email Field */}
      <input name="email" type="email" required />
      {state.errors?.email && <p>{state.errors.email[0]}</p>}
      
      {/* Motivation Field */}
      <textarea name="motivation" maxLength={1000} />
      
      {/* Favorite Language */}
      <select name="favorite_language" required>
        <option value="JavaScript">JavaScript</option>
        <option value="Python">Python</option>
        <option value="Java">Java</option>
        <option value="C#">C#</option>
        <option value="Otro">Otro</option>
      </select>
      
      <button type="submit" disabled={pending}>
        {pending ? 'Enviando...' : 'Enviar Respuesta'}
      </button>
      
      {state.message && <p>{state.message}</p>}
    </form>
  )
}
```

#### Server Action con Zod (Context7):
```typescript
// app/actions/form.ts
'use server'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string()
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Formato de email inválido' }),
  motivation: z.string()
    .max(1000, { message: 'Máximo 1000 caracteres' })
    .optional()
    .or(z.literal('')),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'], {
    errorMap: () => ({ message: 'Selecciona un lenguaje' })
  })
})

type FormState = {
  message: string
  errors?: Record<string, string[]>
  success: boolean
}

export async function submitResponse(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Parse y validar con safeParse
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
    motivation: formData.get('motivation') || '',
    favorite_language: formData.get('favorite_language')
  })

  if (!validatedFields.success) {
    return {
      message: 'Corrige los errores del formulario',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data)
    })

    if (!response.ok) {
      if (response.status === 409) {
        return {
          message: 'Este email ya ha respondido el formulario',
          errors: { email: ['Email ya registrado'] },
          success: false
        }
      }
      throw new Error('Error al enviar')
    }

    return { message: '¡Gracias por tu respuesta!', success: true }
  } catch (error) {
    return { message: 'Error de conexión', success: false }
  }
}
```
> 📘 **Referencia**: [GUIA_IMPLEMENTACION.md - Sección 1](./GUIA_IMPLEMENTACION.md#1-nextjs-14-app-router---forms-y-validación)

#### Estados a manejar:
- [ ] Loading durante envío
- [ ] Error de validación en campos
- [ ] Error de email duplicado
- [ ] Éxito con confirmación

#### Entregables:
- [ ] Página `/form` creada
- [ ] Componente `FormComponent` funcional
- [ ] Validación en tiempo real
- [ ] Manejo de errores y estados de carga
- [ ] Mensaje de éxito después de envío

---

### **FASE 6: Implementar Dashboard**

#### Componentes requeridos:

| Componente | Funcionalidad | Endpoint |
|------------|---------------|----------|
| `ResponseCounter` | Número total de respuestas | `GET /api/responses/count` |
| `RecentUsersList` | Lista 5 últimos usuarios + modal | `GET /api/responses/recent` |
| `LanguageStats` | Gráfico/tabla estadísticas | `GET /api/responses/stats` |

#### Flujo de datos:
```
Dashboard Page
  ├── fetch /api/responses/count    → ResponseCounter
  ├── fetch /api/responses/recent   → RecentUsersList
  │       └── onClick → fetch /api/responses/:email → Modal
  └── fetch /api/responses/stats    → LanguageStats
```

#### Funcionalidad crítica - Click en usuario (Context7: React hooks):
```tsx
// components/dashboard/RecentUsersList.tsx
'use client'
import { useState } from 'react'

interface User {
  email: string
  motivation: string | null
  submitted_at: string
}

export function RecentUsersList({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Últimos 5 Usuarios</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">
                {new Date(user.submitted_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal con Tailwind */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-2">{selectedUser.email}</h3>
            <p className="text-gray-600 mb-4">
              {selectedUser.motivation || 'Sin respuesta de motivación'}
            </p>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
```

#### Componentes UI con Tailwind (Context7):
```tsx
// components/ui/Card.tsx
export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  )
}

// components/dashboard/StatsCard.tsx
export function StatsCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}
```
> 📘 **Referencia**: [GUIA_IMPLEMENTACION.md - Sección 5](./GUIA_IMPLEMENTACION.md#5-tailwind-css---componentes-ui)

#### Entregables:
- [ ] Página `/dashboard` creada
- [ ] Componente `ResponseCounter` funcionando
- [ ] Componente `RecentUsersList` con click interactivo
- [ ] Componente `LanguageStats` mostrando datos
- [ ] Modal/expandible para mostrar motivación
- [ ] Estados de carga (skeleton/spinner)

---

### **FASE 7: Integración y Testing**

#### Checklist de validación:

**Formulario:**
- [ ] Email requerido y formato válido
- [ ] Email duplicado muestra error claro: "Este email ya ha respondido el formulario"
- [ ] Motivación es opcional (puede enviarse vacío)
- [ ] Lenguaje es obligatorio
- [ ] Loading state durante envío
- [ ] Mensaje de éxito después de envío
- [ ] Redirección o limpieza de formulario

**Dashboard:**
- [ ] Contador muestra número correcto
- [ ] Lista muestra exactamente 5 usuarios más recientes
- [ ] Email y fecha/hora visibles en cada item
- [ ] Click en usuario muestra su motivación
- [ ] Estadísticas muestran conteo correcto por lenguaje
- [ ] Estados de carga (skeleton/spinner)

**Navegación:**
- [ ] Link Inicio → Formulario funciona
- [ ] Link Inicio → Dashboard funciona
- [ ] Link Formulario ↔ Dashboard funciona
- [ ] Navegación responsive

**Responsive:**
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

---

## 🔄 ORDEN DE EJECUCIÓN

```
┌─────────────────────────────────────────────────────────────┐
│  1. Setup PostgreSQL                                        │
│     └── Crear database, tabla, índices                      │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Backend Structure                                       │
│     └── Crear carpetas, instalar dependencias               │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. API Endpoints                                           │
│     └── Implementar POST, GET (count, recent, stats, email) │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Test Backend                                            │
│     └── Probar con curl/Postman                             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Frontend Structure                                      │
│     └── Crear carpetas, API service, tipos                  │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Form Page                                               │
│     └── Formulario con validación y envío                   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Dashboard Page                                          │
│     └── Contador, lista usuarios, estadísticas              │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  8. Integration Testing                                     │
│     └── Probar flujo completo, responsive, edge cases       │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  9. Polish & Documentation                                  │
│     └── UI/UX, loading states, README                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 COMANDOS RÁPIDOS

### Terminal 1: Backend
```bash
cd backend-service
npm install
npm run dev
# Servidor en http://localhost:4001
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
# Servidor en http://localhost:3000
```

### Terminal 3: PostgreSQL
```bash
# Acceder a PostgreSQL
psql postgres

# Crear base de datos
CREATE DATABASE prueba_tecnica;

# Conectar a la base de datos
\c prueba_tecnica

# Ejecutar schema
\i database/schema.sql

# Verificar tabla
\dt
\d responses
```

### Probar endpoints con curl:
```bash
# Enviar respuesta
curl -X POST http://localhost:4001/dev/backend/api/responses \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","motivation":"Test","favorite_language":"JavaScript"}'

# Obtener conteo
curl http://localhost:4001/dev/backend/api/responses/count

# Obtener recientes
curl http://localhost:4001/dev/backend/api/responses/recent

# Obtener estadísticas
curl http://localhost:4001/dev/backend/api/responses/stats

# Obtener por email
curl http://localhost:4001/dev/backend/api/responses/test@test.com
```

---

## 📝 COMMITS SUGERIDOS

Siguiendo Conventional Commits:

```bash
# Fase 1
git commit -m "feat(database): add PostgreSQL schema and indexes"

# Fase 2
git commit -m "feat(backend): add project structure and database service"

# Fase 3
git commit -m "feat(api): implement CRUD endpoints for responses"

# Fase 4
git commit -m "feat(frontend): add project structure and API service"

# Fase 5
git commit -m "feat(form): implement form page with validation"

# Fase 6
git commit -m "feat(dashboard): implement dashboard with statistics"

# Fase 7
git commit -m "feat(ui): add navigation and responsive design"

# Final
git commit -m "docs: update README with implementation details"
```

---

## ✅ CRITERIOS DE ÉXITO

### Funcionalidad (Obligatorio)
- [x] Formulario funciona correctamente
- [x] Validaciones según especificaciones
- [x] No se permiten respuestas duplicadas por email
- [x] Dashboard muestra toda la información requerida
- [x] Interacción entre componentes funciona

### Código y Arquitectura
- [x] Código limpio y bien estructurado
- [x] Separación correcta frontend/backend
- [x] Manejo adecuado de errores
- [x] TypeScript con tipos definidos

### Base de Datos
- [x] Diseño apropiado con constraints
- [x] Queries eficientes con índices
- [x] Integridad de datos garantizada

### Extras (Bonus)
- [ ] Interfaz de usuario atractiva
- [ ] Responsive design
- [ ] Estados de carga
- [ ] Documentación adicional

---

## 📚 RECURSOS

### Documentación Oficial
- [Next.js Documentation](https://nextjs.org/docs)
- [Node-Postgres Documentation](https://node-postgres.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Documentación del Proyecto
- [GUIA_IMPLEMENTACION.md](./GUIA_IMPLEMENTACION.md) - Guía completa con patrones Context7
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Instrucciones para GitHub Copilot
- [.github/instructions/commit.instructions.md](./.github/instructions/commit.instructions.md) - Guía de commits

### Patrones Clave Context7 Utilizados

| Patrón | Fuente Context7 | Ubicación en Código |
|--------|----------------|---------------------|
| **useActionState** | `/vercel/next.js` | `components/FormComponent.tsx` |
| **Server Actions** | `/vercel/next.js` | `app/actions/form.ts` |
| **Pool de conexiones** | `/brianc/node-postgres` | `services/database.ts` |
| **Queries parametrizadas** | `/brianc/node-postgres` | `repositories/responseRepository.ts` |
| **safeParse validation** | `/colinhacks/zod` | `app/actions/form.ts`, `middleware/validation.ts` |
| **serverless-express** | `/codegenieapp/serverless-express` | `handler.ts` |
| **Responsive classes** | `/websites/v3_tailwindcss` | `components/ui/*.tsx` |
| **Modal pattern** | `/websites/v3_tailwindcss` | `components/dashboard/RecentUsersList.tsx` |

### Estructura Completa de Archivos

```
oneapp2-prueba-tecnica/
├── backend-service/
│   ├── src/
│   │   ├── handler.ts                    # Serverless entry (Context7: serverless-express)
│   │   ├── app.ts                        # Express app con CORS
│   │   ├── routes/
│   │   │   └── responseRoutes.ts         # Definición de rutas
│   │   ├── controllers/
│   │   │   └── responseController.ts     # Lógica de negocio
│   │   ├── repositories/
│   │   │   └── responseRepository.ts     # Queries SQL (Context7: node-postgres)
│   │   ├── services/
│   │   │   └── database.ts               # Pool config (Context7: node-postgres)
│   │   ├── middleware/
│   │   │   ├── validation.ts             # Zod middleware (Context7: zod)
│   │   │   └── errorHandler.ts           # Error handling
│   │   └── validators/
│   │       └── responseValidator.ts      # Zod schemas (Context7: zod)
│   ├── serverless.yml                    # Serverless config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── actions/
│   │   │   │   └── form.ts               # Server Actions (Context7: Next.js)
│   │   │   ├── form/
│   │   │   │   └── page.tsx              # Form page
│   │   │   └── dashboard/
│   │   │       └── page.tsx              # Dashboard page
│   │   ├── components/
│   │   │   ├── FormComponent.tsx         # useActionState (Context7: Next.js)
│   │   │   ├── dashboard/
│   │   │   │   ├── RecentUsersList.tsx   # Modal pattern (Context7: Tailwind)
│   │   │   │   ├── ResponseCounter.tsx
│   │   │   │   └── LanguageStats.tsx
│   │   │   └── ui/
│   │   │       ├── Card.tsx              # Tailwind components
│   │   │       └── StatsCard.tsx
│   │   └── services/
│   │       └── api.ts                    # API client
│   └── package.json
│
├── database/
│   ├── schema.sql                        # PostgreSQL schema
│   └── seed.sql                          # Test data
│
├── GUIA_IMPLEMENTACION.md                # 📘 Guía detallada con Context7
├── PLAN_IMPLEMENTACION.md                # Este archivo
└── README.md
```

---

**¡Buena suerte con la implementación!** 🚀

> 💡 **Tip**: Consulta [GUIA_IMPLEMENTACION.md](./GUIA_IMPLEMENTACION.md) cuando necesites ejemplos completos de código o patrones específicos.
