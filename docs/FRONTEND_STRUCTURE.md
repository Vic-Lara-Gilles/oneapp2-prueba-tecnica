# Estructura del Proyecto Frontend

> **Nota**: Esta arquitectura fue diseñada consultando documentación oficial a través de **Context7** (`/vercel/next.js`) para asegurar el uso de patrones modernos y best practices de Next.js 14.

## 📁 Nueva Estructura (Siguiendo Next.js 14 Best Practices)

```
frontend/src/
├── app/                                 # App Router (Next.js 14)
│   ├── layout.tsx                      # Root layout (requerido)
│   ├── page.tsx                        # Home page (/)
│   ├── globals.css                     # Estilos globales
│   │
│   ├── form/                           # Ruta: /form
│   │   ├── page.tsx                   # Página del formulario
│   │   └── actions.ts                 # Server Actions del formulario (colocation)
│   │
│   └── dashboard/                      # Ruta: /dashboard
│       ├── page.tsx                   # Página del dashboard
│       └── _components/               # Componentes privados (no ruteables)
│           ├── ResponseCounter.tsx    # Contador de respuestas
│           ├── LanguageStatsCard.tsx  # Estadísticas de lenguajes
│           └── RecentUsersList.tsx    # Lista de usuarios recientes
│
├── components/                         # Componentes compartidos
│   └── UserModal.tsx                  # Modal de detalles de usuario
│
└── services/                           # Servicios compartidos
    ├── api.ts                         # Cliente API
    └── api.types.ts                   # Tipos TypeScript del API
```

## 🎯 Mejoras Implementadas

> **Context7 Consultation**: Todos los patrones siguientes fueron validados consultando `/vercel/next.js` en Context7 para asegurar conformidad con las últimas recomendaciones oficiales de Next.js 14.

### 1. **Colocation Pattern**
- **Fuente**: Context7 `/vercel/next.js` - Server Actions & Mutations
- **Antes**: `app/actions/form.ts` (centralizado)
- **Ahora**: `app/form/actions.ts` (junto a la ruta)
- **Beneficio**: Server Actions junto al código que las usa
- **Rationale**: Next.js 14 recomienda colocar Server Actions cerca de donde se usan para mejor mantenibilidad

### 2. **Carpetas Privadas (Private Folders)**
- **Fuente**: Context7 `/vercel/next.js` - Routing Colocation
- **Sintaxis**: Prefijo `_` → `_components/`
- **Beneficio**: No son ruteables, solo para organización interna
- **Uso**: Componentes específicos de una ruta (no compartidos)
- **Rationale**: Previene acceso accidental a rutas internas y mejora organización

### 3. **Tipos Separados**
- **Antes**: Tipos mezclados en `api.ts`
- **Ahora**: `api.types.ts` separado
- **Beneficio**: Mejor separación de concerns, reutilización
- **Rationale**: TypeScript best practice para mantener tipos reutilizables

### 4. **Feature-Based Organization**
- **Fuente**: Context7 `/vercel/next.js` - Project Organization
```
dashboard/
├── page.tsx              # Página principal
├── layout.tsx            # Metadata SEO
├── loading.tsx           # Loading UI (Suspense)
├── error.tsx             # Error Boundary
└── _components/          # Componentes privados
    ├── ResponseCounter
    ├── LanguageStatsCard
    ├── RecentUsersList
    └── UserModal
```

### 5. **Metadata API (SEO)**
- **Fuente**: Context7 `/vercel/next.js` - Metadata
- **Implementación**: `layout.tsx` por ruta con metadata específica
- **Beneficio**: SEO optimizado, OpenGraph, Twitter Cards

### 6. **Loading States (Suspense)**
- **Fuente**: Context7 `/vercel/next.js` - Loading UI
- **Implementación**: `loading.tsx` por ruta
- **Beneficio**: UX profesional con skeleton loaders automáticos

### 7. **Error Boundaries**
- **Fuente**: Context7 `/vercel/next.js` - Error Handling
- **Implementación**: `error.tsx` por ruta + `global-error.tsx`
- **Beneficio**: Manejo granular de errores sin romper toda la app

### 8. **Custom 404 Page**
- **Fuente**: Context7 `/vercel/next.js` - Not Found
- **Implementación**: `not-found.tsx` en app root
- **Beneficio**: Página 404 personalizada con navegación

## 📝 Patrón de Imports

### Server Actions (Colocation)
```typescript
// Antes
import { submitResponse } from '@/app/actions/form'

// Ahora (relative import)
import { submitResponse } from './actions'
```

### Componentes Privados
```typescript
// En app/dashboard/page.tsx
import ResponseCounter from './_components/ResponseCounter'
import LanguageStatsCard from './_components/LanguageStatsCard'
import RecentUsersList from './_components/RecentUsersList'
```

### Componentes Compartidos
```typescript
// Desde cualquier lugar
import UserModal from '@/components/UserModal'
```

### Tipos del API
```typescript
// Antes
import type { ResponseEntity } from '@/services/api'

// Ahora (funciona igual, pero con re-export)
import type { ResponseEntity } from '@/services/api'
// O directamente
import type { ResponseEntity } from '@/services/api.types'
```

## ✅ Beneficios de esta Estructura

1. **Escalabilidad**: Cada feature tiene su carpeta
2. **Colocation**: Código relacionado junto
3. **Encapsulamiento**: `_components` no son ruteables
4. **Tipos Centralizados**: `api.types.ts` para reutilización
5. **Mejor DX**: Imports más simples con rutas relativas
6. **Next.js 14 Native**: Sigue las convenciones oficiales

## 🔍 Reglas de Organización

### ¿Cuándo usar `_components/`?
- ✅ Componentes usados solo en esa ruta
- ✅ No se comparten entre páginas
- ✅ UI específica de esa feature

### ¿Cuándo usar `components/` (raíz)?
- ✅ Componentes reutilizables
- ✅ Compartidos entre múltiples rutas
- ✅ UI genérica (modals, buttons, cards)

### ¿Cuándo colocar actions junto a page?
- ✅ Server Actions específicas de esa ruta
- ✅ No se reutilizan en otras páginas
- ✅ Lógica de negocio del feature

## 📚 Referencias

### Documentación Oficial Consultada (Context7)

Todos los patrones implementados fueron validados contra documentación oficial:

**Context7 Library ID**: `/vercel/next.js`

**Temas Consultados**:
- **Server Actions & Mutations**: Patrones de colocation y useActionState
- **Routing Colocation**: Private folders y organización de archivos
- **Metadata**: API de metadata para SEO
- **Loading UI**: Suspense boundaries y loading.tsx
- **Error Handling**: Error boundaries y recovery
- **Not Found**: Páginas 404 personalizadas

**Recursos Adicionales**:
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [Private Folders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

**Actualizado**: 2026-01-29  
**Next.js Version**: 14.2.35  
**Patrón**: Feature-Based + Colocation  
**Validado con**: Context7 (`/vercel/next.js`)
