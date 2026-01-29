# Estructura del Proyecto Frontend

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

### 1. **Colocation Pattern (Context7: /vercel/next.js)**
- **Antes**: `app/actions/form.ts` (centralizado)
- **Ahora**: `app/form/actions.ts` (junto a la ruta)
- **Beneficio**: Server Actions junto al código que las usa

### 2. **Carpetas Privadas (Private Folders)**
- **Sintaxis**: Prefijo `_` → `_components/`
- **Beneficio**: No son ruteables, solo para organización interna
- **Uso**: Componentes específicos de una ruta (no compartidos)

### 3. **Tipos Separados**
- **Antes**: Tipos mezclados en `api.ts`
- **Ahora**: `api.types.ts` separado
- **Beneficio**: Mejor separación de concerns, reutilización

### 4. **Feature-Based Organization**
```
dashboard/
├── page.tsx              # Página principal
└── _components/          # Componentes privados
    ├── ResponseCounter
    ├── LanguageStatsCard
    └── RecentUsersList
```

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

- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [Private Folders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**Actualizado**: 2026-01-29  
**Next.js Version**: 14.2.35  
**Patrón**: Feature-Based + Colocation
