-- ============================================
-- Schema: responses table
-- ============================================
-- Tabla para almacenar respuestas del formulario
-- con validaciones y constraints según especificaciones

-- Crear tabla de respuestas
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  motivation TEXT,
  favorite_language VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraint de unicidad para email (CRÍTICO: una respuesta por email)
  CONSTRAINT responses_email_unique UNIQUE (email),
  
  -- Constraint de validación para lenguajes permitidos
  CONSTRAINT check_favorite_language 
    CHECK (favorite_language IN ('JavaScript', 'Python', 'Java', 'C#', 'Otro'))
);

-- ============================================
-- Índices para optimización de queries
-- ============================================

-- Índice para búsquedas por email (usado en verificación de duplicados)
CREATE INDEX IF NOT EXISTS idx_responses_email 
  ON responses(email);

-- Índice para ordenamiento por fecha (usado en "últimas 5 respuestas")
CREATE INDEX IF NOT EXISTS idx_responses_submitted_at 
  ON responses(submitted_at DESC);

-- Índice para agrupación por lenguaje (usado en estadísticas)
CREATE INDEX IF NOT EXISTS idx_responses_favorite_language 
  ON responses(favorite_language);

-- ============================================
-- Comentarios de documentación
-- ============================================

COMMENT ON TABLE responses IS 'Almacena respuestas del formulario de aplicación';
COMMENT ON COLUMN responses.id IS 'Identificador único autogenerado';
COMMENT ON COLUMN responses.email IS 'Email único del aplicante (constraint UNIQUE)';
COMMENT ON COLUMN responses.motivation IS 'Respuesta opcional sobre motivación (max 1000 chars en backend)';
COMMENT ON COLUMN responses.favorite_language IS 'Lenguaje de programación favorito (valores restringidos por CHECK)';
COMMENT ON COLUMN responses.submitted_at IS 'Timestamp de envío con timezone';

-- ============================================
-- Verificación
-- ============================================

-- Para verificar la creación correcta:
-- \dt responses
-- \d responses
