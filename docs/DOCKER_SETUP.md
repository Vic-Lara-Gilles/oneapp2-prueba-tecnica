# 🐳 Docker/OrbStack - Configuración de Base de Datos

## 📋 Archivos Creados

- `docker-compose.yml` - Orquestación de servicios PostgreSQL + PgAdmin
- `backend-service/.env.example` - Template de variables de entorno
- `database/README.md` - Actualizado con instrucciones de Docker

## 🚀 Inicio Rápido

### 1. Iniciar Base de Datos

```bash
# Desde la raíz del proyecto
docker compose up -d postgres

# Ver logs
docker compose logs -f postgres
```

### 2. Verificar Conexión

```bash
# Conectarse a PostgreSQL
docker compose exec postgres psql -U postgres -d prueba_tecnica

# Dentro de psql:
\dt              # Ver tablas
SELECT * FROM responses;  # Ver datos de prueba
\q               # Salir
```

### 3. Configurar Backend

```bash
# Copiar archivo de ejemplo
cp backend-service/.env.example backend-service/.env

# El archivo .env ya contiene:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prueba_tecnica
```

## 🎯 Características Implementadas

✅ **PostgreSQL 14-alpine** (imagen ligera)  
✅ **Volumen persistente** (los datos sobreviven a reinicios)  
✅ **Auto-inicialización** (ejecuta schema.sql y seed.sql automáticamente)  
✅ **Health check** (verifica que la BD esté lista)  
✅ **PgAdmin opcional** (interfaz gráfica en http://localhost:5050)  
✅ **Network aislada** (comunicación entre servicios)  

## 🛠️ Comandos Útiles

```bash
# Iniciar solo PostgreSQL
docker compose up -d postgres

# Iniciar PostgreSQL + PgAdmin
docker compose --profile tools up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs postgres
docker compose logs -f postgres  # Seguir logs en tiempo real

# Detener (mantiene datos)
docker compose stop

# Reiniciar
docker compose restart postgres

# Detener y eliminar contenedores (mantiene volumen)
docker compose down

# Eliminar TODO incluyendo datos
docker compose down -v

# Resetear base de datos (eliminar y recrear)
docker compose down
docker compose up -d postgres
```

## 🔌 Conexión desde el Backend

La conexión se realiza a través de la variable `DATABASE_URL`:

```typescript
// backend-service/src/services/database.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // postgresql://postgres:postgres@localhost:5432/prueba_tecnica
})
```

## 🌐 PgAdmin (Opcional)

Si quieres usar PgAdmin para gestión visual:

```bash
# Iniciar con PgAdmin
docker compose --profile tools up -d

# Acceder a PgAdmin
# URL: http://localhost:5050
# Email: admin@pruebatecnica.com
# Password: admin
```

**Agregar servidor en PgAdmin:**
- General > Name: `Prueba Técnica`
- Connection > Host: `postgres` (nombre del servicio Docker)
- Connection > Port: `5432`
- Connection > Username: `postgres`
- Connection > Password: `postgres`
- Connection > Database: `prueba_tecnica`

## 📊 Datos de Prueba

El contenedor ejecuta automáticamente:
1. `schema.sql` - Crea tabla `responses` con constraints e índices
2. `seed.sql` - Inserta 8 registros de prueba

Para verificar:

```bash
docker compose exec postgres psql -U postgres -d prueba_tecnica -c "SELECT COUNT(*) FROM responses;"
# Resultado: 8
```

## 🔧 Troubleshooting

### Puerto 5432 ya en uso

```bash
# Verificar qué proceso usa el puerto
lsof -i :5432

# Detener PostgreSQL local si está corriendo
brew services stop postgresql
# o
sudo systemctl stop postgresql
```

### Resetear base de datos

```bash
# Eliminar volumen y recrear
docker compose down -v
docker compose up -d postgres
```

### Ver logs de error

```bash
docker compose logs postgres
```

### Eliminar todo y empezar de nuevo

```bash
docker compose down -v
docker volume prune
docker compose up -d postgres
```

## 📝 Notas

- **Usuario**: postgres
- **Contraseña**: postgres  
- **Base de datos**: prueba_tecnica
- **Puerto**: 5432 (expuesto en localhost)
- **Volumen**: `prueba-tecnica-postgres-data` (persistente)
- **Scripts**: Se ejecutan automáticamente en orden alfabético desde `/docker-entrypoint-initdb.d/`

---

**Próximos Pasos:**

1. ✅ Base de datos configurada con Docker
2. ⏭️ Crear estructura del backend (services, routes, controllers)
3. ⏭️ Implementar API endpoints
4. ⏭️ Desarrollar frontend

