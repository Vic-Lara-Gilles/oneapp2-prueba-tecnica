# Frontend - Sistema de Formularios y Dashboard

Frontend de la prueba técnica desarrollado con Next.js 14 (App Router), React 18 y TypeScript.

## 📋 Requisitos Previos

- **Node.js**: 18.0.0 o superior
- **npm**: 8.0.0 o superior

```bash
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
```

## 🏃‍♂️ Ejecutar el Proyecto

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start

# Ejecutar linter
npm run lint
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 🔧 Configuración

### Variable de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001/dev/backend
```

### Requisitos del Backend

- Backend ejecutándose en `http://localhost:4001`
- PostgreSQL activo en `localhost:5432`

## 🎯 Características

### Formulario (`/form`)
- Campo de email con validación de formato y unicidad
- Pregunta opcional: "¿Qué te motivó a aplicar a esta posición?" (máx. 1000 caracteres)
- Pregunta requerida: "¿Cuál es tu lenguaje de programación favorito?"
- Validación en tiempo real con Zod
- Server Actions de Next.js 14

### Dashboard (`/dashboard`)
- **Contador de Respuestas**: Total de formularios enviados
- **Lista de Usuarios Recientes**: Últimos 5 usuarios con email y fecha
- **Modal Interactivo**: Click en usuario para ver motivación completa
- **Estadísticas de Lenguajes**: Visualización con contadores y porcentajes

### Interfaz
- Diseño responsive (mobile, tablet, desktop)
- Componentes con Tailwind CSS
- Estados de carga y manejo de errores
- Navegación intuitiva

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                          # App Router Next.js 14
│   │   ├── layout.tsx               # Root layout + Metadata SEO
│   │   ├── page.tsx                 # Página de inicio (/)
│   │   ├── loading.tsx              # Loading UI global
│   │   ├── error.tsx                # Error boundary global
│   │   ├── global-error.tsx         # Error boundary crítico
│   │   ├── not-found.tsx            # Página 404
│   │   ├── globals.css              # Estilos globales + Tailwind
│   │   │
│   │   ├── _components/             # Componentes privados home
│   │   │   ├── NavigationCard.tsx
│   │   │   ├── BackLink.tsx
│   │   │   └── TechStack.tsx
│   │   │
│   │   ├── form/                    # Ruta: /form
│   │   │   ├── page.tsx             # Página del formulario
│   │   │   ├── actions.ts           # Server Actions
│   │   │   ├── layout.tsx           # Metadata SEO
│   │   │   ├── loading.tsx          # Skeleton
│   │   │   ├── error.tsx            # Error handler
│   │   │   └── _components/         # Componentes del formulario
│   │   │       ├── FormInput.tsx
│   │   │       ├── FormTextarea.tsx
│   │   │       ├── FormSelect.tsx
│   │   │       ├── FormMessage.tsx
│   │   │       └── SubmitButton.tsx
│   │   │
│   │   └── dashboard/               # Ruta: /dashboard
│   │       ├── page.tsx             # Página del dashboard
│   │       ├── layout.tsx           # Metadata SEO
│   │       ├── loading.tsx          # Skeleton
│   │       ├── error.tsx            # Error handler
│   │       └── _components/         # Componentes del dashboard
│   │           ├── ResponseCounter.tsx
│   │           ├── LanguageStatsCard.tsx
│   │           ├── RecentUsersList.tsx
│   │           ├── RefreshButton.tsx
│   │           └── UserModal.tsx
│   │
│   ├── components/ui/               # Componentes UI reutilizables
│   │   ├── Button.tsx               # Botón polimórfico
│   │   ├── Card.tsx                 # Tarjeta con variantes
│   │   ├── ErrorContainer.tsx       # Layout para errores
│   │   └── index.ts                 # Exports centralizados
│   │
│   └── services/                    # Servicios compartidos
│       ├── api.ts                   # Cliente HTTP
│       └── api.types.ts             # Tipos TypeScript
│
├── public/                          # Archivos estáticos
├── .env.local                       # Variables de entorno (no commitear)
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.2.30 | Framework React con App Router |
| React | 18.2.0 | Biblioteca UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 3.4.0 | Framework CSS |
| Zod | 4.3.6 | Validación de esquemas |

## 🔄 Patrones Implementados

### Server Actions (Next.js 14)

```typescript
'use client'
import { useFormState } from 'react-dom'
import { submitResponse } from './actions'

const [state, formAction] = useFormState(submitResponse, initialState)

<form action={formAction}>
  {/* campos del formulario */}
</form>
```

### Colocation Pattern

Server Actions junto a la ruta que las usa: `app/form/actions.ts`

### Private Folders

Carpetas con prefijo `_` no son ruteables: `_components/`

### Error Boundaries

`error.tsx` por ruta para manejo granular de errores.

### Loading States

`loading.tsx` con skeleton screens para UX profesional.

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Error de conexión con el backend
```bash
# Verificar backend
curl http://localhost:4001/dev/backend/health

# Verificar PostgreSQL
docker ps | grep postgres
```

### Error: "Este email ya ha respondido"
Comportamiento esperado: cada email solo puede enviar el formulario una vez.

## 📚 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run build` | Construir para producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |

---

**Nota**: Este frontend es parte del sistema full-stack. Ver [README principal](../README.md) para documentación completa.
