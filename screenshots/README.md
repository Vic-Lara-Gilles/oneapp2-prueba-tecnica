# 📸 Screenshots de la Aplicación

## Demostración de Funcionalidades

### 1. Página Principal
**Archivo**: `01-home-page.png`
- Navegación a Formulario y Dashboard
- Diseño responsive

### 2. Formulario Vacío
**Archivo**: `02-form-empty.png`
- Campo email (requerido)
- Campo motivación (opcional, max 1000 chars)
- Select de lenguaje favorito (requerido)

### 3. Validación de Errores
**Archivo**: `03-form-validation.png`
- Email inválido
- Lenguaje no seleccionado
- Mensajes de error en rojo

### 4. Envío Exitoso
**Archivo**: `04-form-success.png`
- Mensaje de confirmación
- Formulario limpio

### 5. Email Duplicado (409)
**Archivo**: `05-form-duplicate-email.png`
- Error: "Este email ya ha respondido el formulario"
- Status 409 Conflict

### 6. Dashboard Completo
**Archivo**: `06-dashboard.png`
**Componentes visibles**:
1. **Contador**: Total de respuestas
2. **Lista de Usuarios**: Últimos 5 con email y fecha
3. **Estadísticas**: Gráfico/tabla de lenguajes

### 7. Modal de Motivación
**Archivo**: `07-modal-open.png`
- Click en usuario abre modal
- Muestra email y texto de motivación
- Botón cerrar

### 8. Base de Datos con Datos
**Archivo**: `08-database-data.png`
- Terminal ejecutando: `make db-count` o `psql`
- Muestra 10+ registros con emails únicos

### 9. API Health Check
**Archivo**: `09-api-health.png`
- Navegador en: `http://localhost:4001/dev/backend/health`
- Respuesta JSON: `{"status":"ok","timestamp":"..."}`

### 10. Backend Corriendo
**Archivo**: `10-backend-running.png`
- Terminal con: `npm run dev` en backend-service
- Puerto 4001 escuchando

---

## 🎥 Instrucciones para Tomar Screenshots

1. **Iniciar servicios**:
   ```bash
   make dev
   ```

2. **Tomar capturas**:
   - macOS: `Cmd + Shift + 4` (selección) o `Cmd + Shift + 3` (pantalla completa)
   - Windows: `Win + Shift + S`
   - Linux: `gnome-screenshot -a`

3. **Guardar en esta carpeta** con los nombres exactos listados arriba

4. **Commit y push**:
   ```bash
   git add screenshots/
   git commit -m "docs: add application screenshots and demonstration"
   git push
   ```

---

## ✅ Checklist de Demostración

- [ ] Aplicación corriendo en localhost:3000
- [ ] Backend respondiendo en localhost:4001
- [ ] PostgreSQL con 10+ registros de prueba
- [ ] Todas las funcionalidades capturadas
- [ ] Screenshots claras y legibles
- [ ] README actualizado con referencias
