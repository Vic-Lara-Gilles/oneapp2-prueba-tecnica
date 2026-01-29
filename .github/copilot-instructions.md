---
description: 'GitHub Copilot instructions for Full Stack Application - Form & Dashboard System'
applyTo: '**'
---

# GitHub Copilot Instructions - Prueba Técnica Full Stack

> 📖 **Documentation**: See [GUIA_IMPLEMENTACION.md](../../GUIA_IMPLEMENTACION.md) for Context7 patterns and [PLAN_IMPLEMENTACION.md](../../PLAN_IMPLEMENTACION.md) for implementation phases

## 🎯 Stack & Architecture

**Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS (port 3000)  
**Backend**: Node.js 18 + Express + Serverless Framework (port 4001)  
**Database**: PostgreSQL 14+ with `pg` driver (port 5432)  

**Application**: Form submission system with analytics dashboard

## 📋 Form Requirements (DO NOT MODIFY)

### Question 1: Motivation (OPTIONAL)
- **Question**: "¿Qué te motivó a aplicar a esta posición?"
- **Type**: Textarea, max 1000 chars

### Question 2: Favorite Language (REQUIRED)
- **Question**: "¿Cuál es tu lenguaje de programación favorito?"
- **Type**: Radio/Select
- **Options**: JavaScript, Python, Java, C#, Otro

### Email Field (REQUIRED)
- Valid email format
- **CRITICAL**: UNIQUE constraint - one submission per email
- Return 409 error: "Este email ya ha respondido el formulario"

## 🏗️ Architecture Guidelines

### Required API Endpoints

```typescript
POST   /api/responses          // Submit new form response
GET    /api/responses/count    // Get total count of responses
GET    /api/responses/recent   // Get last 5 responses (with email and timestamp)
GET    /api/responses/stats    // Get statistics for multiple choice question
GET    /api/responses/:email   // Get specific response by email
```

### Database Schema Requirements

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

## 🎨 Dashboard Components (EXACT SPECIFICATIONS)

### Component 1: Response Counter
- Display total number of form submissions
- Visual card with large number display

### Component 2: Recent Users List
- Show last 5 users who submitted the form
- Display: email address and submission datetime
- **CRITICAL**: Clicking any user reveals their motivation text in a modal

### Component 3: Language Statistics
- Show count for each programming language option
- Display as chart (bar/pie) OR table with counts

## 💻 Code Generation Guidelines

### Frontend Structure (Context7: Next.js 14)

```
frontend/src/
├── app/
│   ├── page.tsx              # Home page
│   ├── actions/form.ts       # Server Actions with useActionState
│   ├── form/page.tsx         # Form submission page
│   └── dashboard/page.tsx    # Analytics dashboard
├── components/
│   ├── FormComponent.tsx     # Form with useActionState hook
│   ├── ResponseCounter.tsx
│   ├── RecentUsersList.tsx   # With modal interaction
│   └── LanguageStats.tsx
└── services/api.ts           # API client
```

#### Form Pattern (Context7: Next.js useActionState)
```tsx
'use client'
import { useActionState } from 'react'

const [state, formAction, pending] = useActionState(submitResponse, initialState)

<form action={formAction}>
  {/* Form fields */}
  <button disabled={pending}>
    {pending ? 'Enviando...' : 'Enviar'}
  </button>
</form>
```

#### Server Action Pattern (Context7: Zod safeParse)
```tsx
'use server'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  motivation: z.string().max(1000).optional(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

export async function submitResponse(prevState, formData) {
  const validatedFields = formSchema.safeParse({...})
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }
  // Call API...
}
```

### Backend Structure (Context7: serverless-express)

```
backend-service/src/
├── handler.ts                # Serverless entry point
├── app.ts                    # Express app
├── routes/responseRoutes.ts
├── controllers/responseController.ts
├── repositories/responseRepository.ts
├── services/database.ts      # Pool configuration
├── validators/responseValidator.ts
└── middleware/
    ├── validation.ts
    └── errorHandler.ts
```

#### Pool Pattern (Context7: node-postgres)
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000
})

export async function query<T>(text: string, params?: any[]) {
  return pool.query<T>(text, params)
}
```

#### Serverless Handler Pattern (Context7: serverless-express)
```typescript
import serverlessExpress from '@codegenie/serverless-express'
import app from './app'

let serverlessExpressInstance

export const handler = async (event, context) => {
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = serverlessExpress({ app })
  }
  return serverlessExpressInstance(event, context)
}
```

#### Repository Pattern (Context7: Parameterized queries)
```typescript
export const responseRepository = {
  async create(data) {
    const sql = `INSERT INTO responses (email, motivation, favorite_language) VALUES ($1, $2, $3) RETURNING *`
    const result = await query(sql, [data.email, data.motivation, data.favorite_language])
    return result.rows[0]
  },
  async emailExists(email) {
    const sql = `SELECT EXISTS(SELECT 1 FROM responses WHERE email = $1)`
    const result = await query(sql, [email])
    return result.rows[0].exists
  }
}
```

#### Validation Middleware (Context7: Zod)
```typescript
import { z } from 'zod'

export const createResponseSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  motivation: z.string().max(1000).optional().nullable(),
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

export function validate(schema, target = 'body') {
  return (req, res, next) => {
    try {
      req[target] = schema.parse(req[target])
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

### UI Components (Context7: Tailwind CSS)

#### Modal Pattern
```tsx
{selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 className="text-xl font-semibold">{selectedUser.email}</h3>
      <p className="text-gray-600">{selectedUser.motivation || 'Sin motivación'}</p>
      <button onClick={() => setSelectedUser(null)} 
        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Cerrar
      </button>
    </div>
  </div>
)}
```

#### Responsive Card
```tsx
<div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
  {/* Content */}
</div>
```

## 📝 Coding Standards

### TypeScript
- Use explicit types, avoid `any`
- Define interfaces for all data structures
- Enable strict mode

### React
- Functional components with hooks
- Proper loading states (`pending` from useActionState)
- Error handling with try-catch

### Naming
- Components: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NODE_ENV=development

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4001
```

## 🔒 Security

- Never commit `.env` files
- Validate inputs on backend
- Use parameterized queries (prevent SQL injection)
- Sanitize user input (prevent XSS)
- Handle PostgreSQL error code 23505 (unique violation)

## 🎯 Success Criteria

- [ ] Form validates correctly (email unique, motivation optional, language required)
- [ ] Dashboard shows: total count, last 5 users, language stats
- [ ] Clicking user reveals motivation in modal
- [ ] Email uniqueness enforced (409 error on duplicate)
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Responsive design (mobile, tablet, desktop)

## 💡 Tips for Copilot

1. **Always validate** code matches exact specifications
2. **Reference** GUIA_IMPLEMENTACION.md for detailed patterns
3. **Follow** PLAN_IMPLEMENTACION.md for implementation order
4. **Include** proper TypeScript types
5. **Never modify** core requirements (form questions, dashboard components)
6. **Use** Context7 patterns: useActionState, Pool, safeParse, serverless-express

---

**Context7 Sources**:
- `/vercel/next.js` - useActionState, Server Actions
- `/brianc/node-postgres` - Pool config, parameterized queries
- `/colinhacks/zod` - safeParse, schema validation
- `/codegenieapp/serverless-express` - handler pattern
- `/websites/v3_tailwindcss` - responsive utilities, modal

**Last Updated**: January 28, 2026  
**Project Type**: Full Stack Technical Assessment
