# Frontend - Sistema de Formularios y Dashboard de Análisis

Este es un proyecto de [Next.js](https://nextjs.org) creado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) que implementa un sistema de captura de datos mediante formularios y visualización de estadísticas en tiempo real.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 8.0.0 o superior (incluido con Node.js)

### Verificar las versiones instaladas:
```bash
node --version
npm --version
```

### Instalar Node.js (si no lo tienes):
- Descarga desde [nodejs.org](https://nodejs.org/)
- O usa un gestor de versiones como nvm:
```bash
# Instalar nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js 18
nvm install 18
nvm use 18
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd "Prueba Técnica Andain/frontend"
```

### 2. Instalar dependencias
```bash
npm install
```

Este comando instalará todas las dependencias necesarias incluyendo:
- Next.js 14.2.30
- React 18.2.0
- TypeScript 5
- Tailwind CSS 3.4.0
- ESLint

### 3. Verificar la instalación
```bash
npm list --depth=0
```

## 🏃‍♂️ Ejecutar el Proyecto

### Servidor de Desarrollo
```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en [http://localhost:3000](http://localhost:3000).

### Otros comandos disponibles:
```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start

# Ejecutar linter
npm run lint
```

## 🔧 Configuración del Backend

**⚠️ Importante**: Antes de usar la aplicación, asegúrate de que el backend service y PostgreSQL estén ejecutándose.

### Requisitos del Backend:
- El backend debe estar ejecutándose en `http://localhost:4001`
- PostgreSQL debe estar activo en `localhost:5432`
- Endpoints principales:
  - `POST /api/responses` - Enviar respuesta del formulario
  - `GET /api/responses/count` - Obtener total de respuestas
  - `GET /api/responses/recent` - Obtener últimas 5 respuestas
  - `GET /api/responses/stats` - Obtener estadísticas de lenguajes

### Variable de Entorno:
```bash
# Crear archivo .env.local en la raíz del frontend
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### Iniciar el Backend:
```bash
# Navegar al directorio del backend
cd ../backend-service

# Instalar dependencias (si es la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## 🎯 Características de la Aplicación

### 1. **Formulario de Captura de Datos**
- Campo de email con validación de formato y unicidad
- Pregunta opcional: "¿Qué te motivó a aplicar a esta posición?" (máx. 1000 caracteres)
- Pregunta requerida: "¿Cuál es tu lenguaje de programación favorito?" (JavaScript, Python, Java, C#, Otro)
- Validación en tiempo real con Zod
- Uso de Server Actions (Next.js 14) para envío sin JavaScript pesado

### 2. **Dashboard de Análisis**
- **Contador de Respuestas**: Total de formularios enviados
- **Lista de Usuarios Recientes**: Últimos 5 usuarios con email y fecha
- **Modal Interactivo**: Click en cualquier usuario para ver su motivación completa
- **Estadísticas de Lenguajes**: Visualización de preferencias con contadores y porcentajes

### 3. **Interfaz Responsive**
- Diseño adaptativo para desktop, tablet y móvil
- Componentes desarrollados con Tailwind CSS
- Navegación intuitiva entre páginas
- Estados de carga y manejo de errores

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                     # App Router de Next.js
│   │   ├── layout.tsx          # Layout principal con navegación
│   │   ├── page.tsx            # Página de inicio
│   │   ├── globals.css         # Estilos globales
│   │   ├── form/
│   │   │   └── page.tsx        # Página del formulario
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard de análisis
│   │   └── actions/
│   │       └── form.ts         # Server Actions para formulario
│   ├── components/
│   │   ├── FormComponent.tsx    # Componente del formulario con validación
│   │   ├── ResponseCounter.tsx  # Contador total de respuestas
│   │   ├── RecentUsersList.tsx  # Lista de últimos 5 usuarios
│   │   ├── LanguageStats.tsx    # Estadísticas de lenguajes
│   │   └── UserModal.tsx        # Modal para mostrar motivación
│   └── services/
│       └── api.ts              # Cliente HTTP para backend API
├── public/                     # Archivos estáticos
├── .env.local                  # Variables de entorno (no commitear)
├── package.json               # Dependencias y scripts
├── tailwind.config.ts         # Configuración de Tailwind
├── next.config.js             # Configuración de Next.js
└── README.md                  # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework de React con App Router y Server Actions
- **React 18**: Biblioteca de interfaces de usuario con hooks modernos
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS utility-first
- **Zod**: Validación de esquemas y tipos
- **ESLint**: Linter para mantener código limpio

## 🔄 Flujo de Datos con Server Actions

Este proyecto utiliza **Server Actions** de Next.js 14, una característica que permite ejecutar código del servidor directamente desde componentes del cliente sin necesidad de crear endpoints API tradicionales.

### Ejemplo de uso en FormComponent.tsx:
```typescript
'use client'
import { useActionState } from 'react'
import { submitResponse } from '../app/actions/form'

const [state, formAction, pending] = useActionState(submitResponse, initialState)

<form action={formAction}>
  {/* campos del formulario */}
  <button disabled={pending}>
    {pending ? 'Enviando...' : 'Enviar'}
  </button>
</form>
```

### Ventajas de Server Actions:
- Menor cantidad de código boilerplate
- Validación automática en el servidor
- Estados de carga integrados con `pending`
- Mejor SEO (funciona sin JavaScript del cliente)
- Manejo de errores simplificado

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Liberar el puerto
lsof -ti:3000 | xargs kill -9

# O usar un puerto diferente
npm run dev -- -p 3001
```

### Error de conexión con el backend
1. Verifica que el backend esté ejecutándose en `http://localhost:4001`
   ```bash
   curl http://localhost:4001/dev/backend/health
   ```
2. Verifica que PostgreSQL esté activo en el puerto 5432
   ```bash
   docker ps | grep postgres
   # o
   lsof -i:5432
   ```
3. Revisa la variable de entorno `NEXT_PUBLIC_API_URL` en `.env.local`
4. Revisa la consola del navegador para errores CORS o de red

### Error: "This email has already submitted the form"
- Este es el comportamiento esperado: cada email solo puede enviar el formulario una vez
- Para probar nuevamente, usa un email diferente o elimina el registro desde la base de datos

### Problemas con Node.js
```bash
# Cambiar a Node.js 18 si usas nvm
nvm use 18

# Verificar la versión
node --version  # Debe ser >= 18.0.0
```

### Error de validación en el formulario
- **Email inválido**: Verifica que el formato sea correcto (ejemplo@dominio.com)
- **Lenguaje no seleccionado**: Este campo es obligatorio
- **Motivación muy larga**: Máximo 1000 caracteres permitidos

## 📚 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en puerto 3000 |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

## 🚀 Despliegue a Producción

### Construcción optimizada:
```bash
npm run build
npm run start
```

### Variables de entorno requeridas:
```bash
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

### Consideraciones:
- Asegúrate de que el backend esté accesible desde la URL pública
- Verifica que CORS esté configurado correctamente en el backend
- Utiliza HTTPS en producción para mayor seguridad

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios siguiendo las convenciones del proyecto
3. Ejecuta las pruebas: `npm run lint`
4. Commit tus cambios con formato conventional: `git commit -m "feat(component): agregar nueva funcionalidad"`
5. Push a tu rama: `git push origin feature/nueva-funcionalidad`

### Convenciones de código:
- Usar TypeScript para todos los componentes
- Seguir el patrón de composición de componentes
- Validar datos con Zod antes de enviar al backend
- Manejar estados de error y carga en todas las peticiones
- Mantener componentes pequeños y reutilizables

---

**Nota**: Este proyecto es parte de un sistema full-stack que incluye backend (Express + Serverless) y base de datos PostgreSQL. Para una experiencia completa, consulta el [README principal](../README.md) del repositorio.
