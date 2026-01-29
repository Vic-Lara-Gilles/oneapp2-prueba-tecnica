# 🧠 Guía de Implementación - Beast Mode Investigation

> Documento de referencia técnica con mejores prácticas investigadas para cada componente del proyecto.

---

## 📋 Índice

1. [Next.js 14 App Router - Forms y Validación](#1-nextjs-14-app-router---forms-y-validación)
2. [PostgreSQL con node-postgres](#2-postgresql-con-node-postgres)
3. [Express + Serverless Framework](#3-express--serverless-framework)
4. [Validación con Zod](#4-validación-con-zod)
5. [Tailwind CSS - Componentes UI](#5-tailwind-css---componentes-ui)
6. [Patrones de Implementación Completos](#6-patrones-de-implementación-completos)

---

## 1. Next.js 14 App Router - Forms y Validación

### 1.1 useActionState Hook (Recomendado)

El hook `useActionState` de React permite manejar formularios con validación del lado del servidor de manera elegante:

```tsx
// src/components/FormComponent.tsx
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
    <form action={formAction} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Motivation Field (Optional) */}
      <div>
        <label htmlFor="motivation" className="block text-sm font-medium">
          ¿Qué te motivó a aplicar a esta posición?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          maxLength={1000}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {state.errors?.motivation && (
          <p className="mt-1 text-sm text-red-600">{state.errors.motivation[0]}</p>
        )}
      </div>

      {/* Favorite Language Field */}
      <div>
        <label className="block text-sm font-medium">
          ¿Cuál es tu lenguaje de programación favorito? *
        </label>
        <div className="mt-2 space-y-2">
          {['JavaScript', 'Python', 'Java', 'C#', 'Otro'].map((lang) => (
            <label key={lang} className="flex items-center">
              <input
                type="radio"
                name="favorite_language"
                value={lang}
                required
                className="h-4 w-4 text-purple-600"
              />
              <span className="ml-2">{lang}</span>
            </label>
          ))}
        </div>
        {state.errors?.favorite_language && (
          <p className="mt-1 text-sm text-red-600">{state.errors.favorite_language[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {pending ? 'Enviando...' : 'Enviar Respuesta'}
      </button>

      {/* Success/Error Messages */}
      {state.message && (
        <p
          aria-live="polite"
          className={`text-center ${state.success ? 'text-green-600' : 'text-red-600'}`}
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
```

### 1.2 Server Actions con Validación Zod

```tsx
// src/app/actions/form.ts
'use server'

import { z } from 'zod'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Formato de email inválido' }),
  motivation: z
    .string()
    .max(1000, { message: 'La motivación no puede exceder 1000 caracteres' })
    .optional()
    .or(z.literal('')),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'], {
    errorMap: () => ({ message: 'Debes seleccionar un lenguaje' })
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
  // Parse and validate form data
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
    motivation: formData.get('motivation') || '',
    favorite_language: formData.get('favorite_language')
  })

  if (!validatedFields.success) {
    return {
      message: 'Por favor corrige los errores del formulario',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false
    }
  }

  const { email, motivation, favorite_language } = validatedFields.data

  try {
    // Call backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motivation, favorite_language })
    })

    if (!response.ok) {
      const errorData = await response.json()
      
      // Handle duplicate email
      if (response.status === 409) {
        return {
          message: '',
          errors: { email: ['Este email ya ha respondido el formulario'] },
          success: false
        }
      }
      
      return {
        message: errorData.error || 'Error al enviar la respuesta',
        success: false
      }
    }

    return {
      message: '¡Gracias por tu respuesta!',
      success: true
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    return {
      message: 'Error de conexión. Por favor intenta de nuevo.',
      success: false
    }
  }
}
```

### 1.3 API Client Service

```typescript
// src/services/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'

interface FormData {
  email: string
  motivation?: string
  favorite_language: string
}

interface ResponseData {
  id: number
  email: string
  motivation: string | null
  favorite_language: string
  submitted_at: string
}

interface StatsData {
  language: string
  count: number
}

export const api = {
  // Submit form response
  async submitResponse(data: FormData): Promise<ResponseData> {
    const response = await fetch(`${API_URL}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error submitting response')
    }
    
    return response.json()
  },

  // Get total count
  async getCount(): Promise<{ total: number }> {
    const response = await fetch(`${API_URL}/api/responses/count`)
    if (!response.ok) throw new Error('Error fetching count')
    return response.json()
  },

  // Get recent responses
  async getRecent(): Promise<ResponseData[]> {
    const response = await fetch(`${API_URL}/api/responses/recent`)
    if (!response.ok) throw new Error('Error fetching recent responses')
    return response.json()
  },

  // Get statistics
  async getStats(): Promise<StatsData[]> {
    const response = await fetch(`${API_URL}/api/responses/stats`)
    if (!response.ok) throw new Error('Error fetching stats')
    return response.json()
  },

  // Get response by email
  async getByEmail(email: string): Promise<ResponseData> {
    const response = await fetch(`${API_URL}/api/responses/${encodeURIComponent(email)}`)
    if (!response.ok) throw new Error('Response not found')
    return response.json()
  },

  // Check if email exists
  async checkEmail(email: string): Promise<{ exists: boolean }> {
    const response = await fetch(`${API_URL}/api/responses/check/${encodeURIComponent(email)}`)
    if (!response.ok) throw new Error('Error checking email')
    return response.json()
  }
}
```

---

## 2. PostgreSQL con node-postgres

### 2.1 Configuración del Pool de Conexiones

```typescript
// backend-service/src/services/database.ts
import { Pool, PoolClient, QueryResult } from 'pg'

// Configuración del pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Configuración para producción
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  // Pool configuration
  max: 20,                      // Máximo de conexiones
  min: 5,                       // Mínimo de conexiones inactivas
  idleTimeoutMillis: 30000,     // Cerrar conexiones inactivas después de 30s
  connectionTimeoutMillis: 2000, // Error si no hay conexión en 2s
  maxLifetimeSeconds: 1800      // Cerrar conexiones mayores a 30 min
})

// Manejo de errores del pool
pool.on('error', (err: Error, client: PoolClient) => {
  console.error('Error inesperado en cliente inactivo:', err)
})

// Función helper para queries
export async function query<T = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  const result = await pool.query<T>(text, params)
  const duration = Date.now() - start
  
  console.log('Query ejecutada', { text, duration, rows: result.rowCount })
  
  return result
}

// Función para transacciones
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Cerrar pool (para testing/shutdown)
export async function closePool(): Promise<void> {
  await pool.end()
}

export default pool
```

### 2.2 Schema SQL Optimizado

```sql
-- migrations/001_create_responses.sql

-- Crear tabla de respuestas
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  motivation TEXT,
  favorite_language VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraint de unicidad para email
  CONSTRAINT responses_email_unique UNIQUE (email),
  
  -- Constraint de validación para lenguajes
  CONSTRAINT check_favorite_language 
    CHECK (favorite_language IN ('JavaScript', 'Python', 'Java', 'C#', 'Otro'))
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_responses_email 
  ON responses(email);

CREATE INDEX IF NOT EXISTS idx_responses_submitted_at 
  ON responses(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_responses_favorite_language 
  ON responses(favorite_language);

-- Comentarios para documentación
COMMENT ON TABLE responses IS 'Almacena respuestas del formulario de aplicación';
COMMENT ON COLUMN responses.email IS 'Email único del aplicante';
COMMENT ON COLUMN responses.motivation IS 'Respuesta opcional sobre motivación';
COMMENT ON COLUMN responses.favorite_language IS 'Lenguaje de programación favorito';
```

### 2.3 Queries Parametrizadas (Seguridad)

```typescript
// backend-service/src/repositories/responseRepository.ts
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

interface LanguageStats {
  favorite_language: string
  count: string
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
  async getLanguageStats(): Promise<LanguageStats[]> {
    const sql = `
      SELECT favorite_language, COUNT(*) as count
      FROM responses
      GROUP BY favorite_language
      ORDER BY count DESC
    `
    const result = await query<LanguageStats>(sql)
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

---

## 3. Express + Serverless Framework

### 3.1 Handler Principal con @codegenie/serverless-express

```typescript
// backend-service/src/handler.ts
import serverlessExpress from '@codegenie/serverless-express'
import app from './app'

// Singleton para reutilizar en warm starts
let serverlessExpressInstance: ReturnType<typeof serverlessExpress>

// Setup asíncrono (conexión a BD, etc.)
async function setup() {
  // Aquí se puede inicializar conexión a BD si es necesario
  console.log('Lambda handler initialized')
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance
}

// Handler exportado
export const handler = async (event: any, context: any) => {
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup()
  }
  return serverlessExpressInstance(event, context)
}
```

### 3.2 Aplicación Express Estructurada

```typescript
// backend-service/src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import responseRoutes from './routes/responseRoutes'
import { errorHandler } from './middleware/errorHandler'

const app: Express = express()

// Middleware de seguridad
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }))

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/responses', responseRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use(errorHandler)

export default app
```

### 3.3 Configuración serverless.yml Completa

```yaml
# backend-service/serverless.yml
service: prueba-tecnica-backend

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  memorySize: 256
  timeout: 30
  environment:
    NODE_ENV: ${self:provider.stage}
    DATABASE_URL: ${env:DATABASE_URL}
    CORS_ORIGIN: ${env:CORS_ORIGIN, '*'}

plugins:
  - serverless-offline
  - serverless-plugin-typescript

custom:
  serverless-offline:
    httpPort: 4001
    noPrependStageInUrl: true
    reloadHandler: true
  esbuild:
    bundle: true
    minify: false
    sourcemap: true
    target: 'node18'

functions:
  api:
    handler: src/handler.handler
    events:
      # Endpoints principales
      - http:
          path: /api/responses
          method: post
          cors: true
      - http:
          path: /api/responses/count
          method: get
          cors: true
      - http:
          path: /api/responses/recent
          method: get
          cors: true
      - http:
          path: /api/responses/stats
          method: get
          cors: true
      - http:
          path: /api/responses/{email}
          method: get
          cors: true
      - http:
          path: /api/responses/check/{email}
          method: get
          cors: true
      # Health check
      - http:
          path: /health
          method: get
          cors: true
      # Catch-all para OPTIONS (CORS preflight)
      - http:
          path: /{proxy+}
          method: options
          cors: true

package:
  individually: true
  patterns:
    - '!node_modules/.prisma/client/libquery_engine-*'
    - 'node_modules/.prisma/client/libquery_engine-rhel-*'
    - '!node_modules/prisma/libquery_engine-*'
    - '!node_modules/@prisma/engines/**'
```

### 3.4 Middleware de Manejo de Errores

```typescript
// backend-service/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method
  })

  const statusCode = error.statusCode || 500
  const message = error.isOperational 
    ? error.message 
    : 'Error interno del servidor'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}

// Helper para crear errores operacionales
export class OperationalError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
```

---

## 4. Validación con Zod

### 4.1 Schemas de Validación

```typescript
// backend-service/src/validators/responseValidator.ts
import { z } from 'zod'

// Schema para crear respuesta
export const createResponseSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido',
      invalid_type_error: 'El email debe ser un texto'
    })
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Formato de email inválido' })
    .max(255, { message: 'El email es demasiado largo' })
    .toLowerCase()
    .trim(),
    
  motivation: z
    .string()
    .max(1000, { message: 'La motivación no puede exceder 1000 caracteres' })
    .optional()
    .nullable()
    .transform(val => val || null),
    
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'], {
    errorMap: () => ({ message: 'Debes seleccionar un lenguaje válido' })
  })
})

// Schema para parámetro email
export const emailParamSchema = z.object({
  email: z
    .string()
    .email({ message: 'Formato de email inválido' })
})

// Tipos inferidos
export type CreateResponseDTO = z.infer<typeof createResponseSchema>
export type EmailParam = z.infer<typeof emailParamSchema>
```

### 4.2 Middleware de Validación

```typescript
// backend-service/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

type ValidationTarget = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target]
      const validatedData = schema.parse(data)
      
      // Reemplazar datos originales con validados
      req[target] = validatedData
      
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
        
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: formattedErrors
        })
      }
      
      next(error)
    }
  }
}
```

---

## 5. Tailwind CSS - Componentes UI

### 5.1 Card Component Responsive

```tsx
// src/components/ui/Card.tsx
interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-lg 
      p-6 sm:p-8 
      ${className}
    `}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
```

### 5.2 Form Styles

```tsx
// src/components/ui/FormStyles.tsx

// Input base classes
export const inputClasses = `
  block w-full 
  px-4 py-2 
  rounded-lg 
  border border-gray-300 
  bg-white 
  text-gray-900 
  placeholder-gray-400
  shadow-sm
  focus:outline-none 
  focus:ring-2 
  focus:ring-purple-500 
  focus:border-transparent
  disabled:opacity-50 
  disabled:cursor-not-allowed
  transition-colors
`

// Textarea classes
export const textareaClasses = `
  ${inputClasses}
  resize-none
`

// Radio button group
export const radioGroupClasses = `
  space-y-3
`

export const radioLabelClasses = `
  flex items-center 
  p-3 
  rounded-lg 
  border border-gray-200 
  cursor-pointer 
  hover:bg-gray-50
  has-[:checked]:border-purple-500 
  has-[:checked]:bg-purple-50
  transition-colors
`

export const radioInputClasses = `
  h-4 w-4 
  text-purple-600 
  border-gray-300 
  focus:ring-purple-500
`

// Button classes
export const buttonPrimaryClasses = `
  w-full 
  py-3 px-6 
  bg-purple-600 
  text-white 
  font-semibold 
  rounded-lg 
  shadow-md
  hover:bg-purple-700 
  focus:outline-none 
  focus:ring-2 
  focus:ring-purple-500 
  focus:ring-offset-2
  disabled:opacity-50 
  disabled:cursor-not-allowed
  transition-all
`

// Error message classes
export const errorMessageClasses = `
  mt-1 
  text-sm 
  text-red-600
`

// Success message classes
export const successMessageClasses = `
  p-4 
  rounded-lg 
  bg-green-50 
  border border-green-200 
  text-green-800
  text-center
`
```

### 5.3 Dashboard Grid Layout

```tsx
// src/components/dashboard/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### 5.4 Stats Card Component

```tsx
// src/components/dashboard/StatsCard.tsx
interface StatsCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold ${trend ? trendColors[trend] : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-purple-100 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
```

### 5.5 User List with Modal Trigger

```tsx
// src/components/dashboard/RecentUsersList.tsx
'use client'

import { useState } from 'react'

interface User {
  email: string
  motivation: string | null
  submitted_at: string
}

interface RecentUsersListProps {
  users: User[]
}

export function RecentUsersList({ users }: RecentUsersListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Últimos Usuarios
        </h3>
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className="
                p-4 rounded-lg border border-gray-200 
                hover:bg-gray-50 hover:border-purple-300
                cursor-pointer transition-colors
              "
            >
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">
                {new Date(user.submitted_at).toLocaleString('es-ES')}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedUser.email}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(selectedUser.submitted_at).toLocaleString('es-ES')}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Motivación:</p>
              <p className="text-gray-600">
                {selectedUser.motivation || 'No proporcionó motivación'}
              </p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="
                mt-4 w-full py-2 px-4 
                bg-gray-100 text-gray-700 
                rounded-lg hover:bg-gray-200 
                transition-colors
              "
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

---

## 6. Patrones de Implementación Completos

### 6.1 Controller Pattern

```typescript
// backend-service/src/controllers/responseController.ts
import { Request, Response, NextFunction } from 'express'
import { responseRepository } from '../repositories/responseRepository'
import { OperationalError } from '../middleware/errorHandler'
import { CreateResponseDTO } from '../validators/responseValidator'

export const responseController = {
  // POST /api/responses
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateResponseDTO = req.body

      // Check for duplicate email
      const exists = await responseRepository.emailExists(data.email)
      if (exists) {
        throw new OperationalError('Este email ya ha respondido el formulario', 409)
      }

      const response = await responseRepository.create(data)
      
      res.status(201).json(response)
    } catch (error: any) {
      // Handle PostgreSQL unique violation
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Este email ya ha respondido el formulario'
        })
      }
      next(error)
    }
  },

  // GET /api/responses/count
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await responseRepository.getCount()
      res.json({ total })
    } catch (error) {
      next(error)
    }
  },

  // GET /api/responses/recent
  async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await responseRepository.getRecent(5)
      res.json(responses)
    } catch (error) {
      next(error)
    }
  },

  // GET /api/responses/stats
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await responseRepository.getLanguageStats()
      res.json(stats.map(s => ({
        language: s.favorite_language,
        count: parseInt(s.count, 10)
      })))
    } catch (error) {
      next(error)
    }
  },

  // GET /api/responses/:email
  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params
      const response = await responseRepository.findByEmail(email)
      
      if (!response) {
        throw new OperationalError('Respuesta no encontrada', 404)
      }
      
      res.json(response)
    } catch (error) {
      next(error)
    }
  },

  // GET /api/responses/check/:email
  async checkEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params
      const exists = await responseRepository.emailExists(email)
      res.json({ exists })
    } catch (error) {
      next(error)
    }
  }
}
```

### 6.2 Routes Definition

```typescript
// backend-service/src/routes/responseRoutes.ts
import { Router } from 'express'
import { responseController } from '../controllers/responseController'
import { validate } from '../middleware/validation'
import { createResponseSchema, emailParamSchema } from '../validators/responseValidator'

const router = Router()

// POST /api/responses - Create new response
router.post(
  '/',
  validate(createResponseSchema, 'body'),
  responseController.create
)

// GET /api/responses/count - Get total count
router.get('/count', responseController.getCount)

// GET /api/responses/recent - Get recent responses
router.get('/recent', responseController.getRecent)

// GET /api/responses/stats - Get language statistics
router.get('/stats', responseController.getStats)

// GET /api/responses/check/:email - Check if email exists
router.get(
  '/check/:email',
  validate(emailParamSchema, 'params'),
  responseController.checkEmail
)

// GET /api/responses/:email - Get response by email
router.get(
  '/:email',
  validate(emailParamSchema, 'params'),
  responseController.getByEmail
)

export default router
```

### 6.3 Frontend Dashboard Page

```tsx
// frontend/src/app/dashboard/page.tsx
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentUsersList } from '@/components/dashboard/RecentUsersList'
import { LanguageChart } from '@/components/dashboard/LanguageChart'
import { api } from '@/services/api'

// Server Component with data fetching
async function getDashboardData() {
  const [countData, recentData, statsData] = await Promise.all([
    api.getCount(),
    api.getRecent(),
    api.getStats()
  ])
  
  return {
    total: countData.total,
    recent: recentData,
    stats: statsData
  }
}

export default async function DashboardPage() {
  const { total, recent, stats } = await getDashboardData()

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard de Respuestas
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Counter */}
          <StatsCard
            title="Total de Respuestas"
            value={total}
          />
          
          {/* Recent Users */}
          <RecentUsersList users={recent} />
          
          {/* Language Stats */}
          <div className="lg:col-span-1">
            <LanguageChart data={stats} />
          </div>
        </div>
      </div>
    </main>
  )
}
```

---

## 📌 Resumen de Mejores Prácticas

### Frontend (Next.js 14)
- ✅ Usar `useActionState` para formularios con Server Actions
- ✅ Validación con Zod tanto en cliente como servidor
- ✅ Componentes de cliente (`'use client'`) solo cuando sea necesario
- ✅ Server Components para data fetching
- ✅ Manejo de estados: loading, error, success

### Backend (Express + Serverless)
- ✅ Pool de conexiones PostgreSQL con configuración optimizada
- ✅ Queries parametrizadas para prevenir SQL injection
- ✅ Middleware de validación con Zod
- ✅ Manejo centralizado de errores
- ✅ CORS configurado correctamente
- ✅ Separación en capas: Routes → Controllers → Repositories

### Base de Datos (PostgreSQL)
- ✅ Constraint UNIQUE en email
- ✅ Índices para queries frecuentes
- ✅ Constraint CHECK para validar lenguajes
- ✅ TIMESTAMP WITH TIME ZONE para fechas

### UI/UX (Tailwind CSS)
- ✅ Diseño responsive con breakpoints
- ✅ Estados hover, focus, disabled
- ✅ Clases reutilizables
- ✅ Accesibilidad (labels, aria-live)
- ✅ Feedback visual para acciones

---

**Última actualización**: Enero 2026  
**Documento generado por**: Beast Mode Investigation 🚀
