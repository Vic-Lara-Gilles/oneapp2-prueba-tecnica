-- ============================================
-- Seed Data: datos de prueba para desarrollo
-- ============================================
-- Este archivo contiene datos de ejemplo para testing
-- NO EJECUTAR EN PRODUCCIÓN

-- Limpiar datos existentes (solo para desarrollo)
TRUNCATE TABLE responses RESTART IDENTITY CASCADE;

-- ============================================
-- Insertar datos de prueba
-- ============================================

-- Usuario 1: Con motivación completa
INSERT INTO responses (email, motivation, favorite_language) VALUES
('maria.garcia@example.com', 
 'Me apasiona el desarrollo web moderno y quiero formar parte de un equipo innovador que use tecnologías de vanguardia. Tengo 5 años de experiencia trabajando con React y Node.js.',
 'JavaScript');

-- Usuario 2: Sin motivación (opcional)
INSERT INTO responses (email, motivation, favorite_language) VALUES
('carlos.rodriguez@example.com', 
 NULL,
 'Python');

-- Usuario 3: Con motivación corta
INSERT INTO responses (email, motivation, favorite_language) VALUES
('ana.lopez@example.com', 
 'Busco nuevos desafíos profesionales en desarrollo backend.',
 'Java');

-- Usuario 4: Lenguaje C#
INSERT INTO responses (email, motivation, favorite_language) VALUES
('juan.martinez@example.com', 
 'Mi experiencia en .NET y mi interés por aprender nuevas tecnologías me motivan a aplicar. Creo que puedo aportar valor al equipo con mis habilidades en arquitectura de software.',
 'C#');

-- Usuario 5: Opción "Otro"
INSERT INTO responses (email, motivation, favorite_language) VALUES
('sofia.hernandez@example.com', 
 'Me especializo en Rust y Go para sistemas de alto rendimiento. Aunque no son los lenguajes principales del stack, mi capacidad de adaptación es alta.',
 'Otro');

-- Usuario 6: Más ejemplos para estadísticas
INSERT INTO responses (email, motivation, favorite_language) VALUES
('pedro.sanchez@example.com', 
 'El ecosistema JavaScript moderno me fascina, especialmente frameworks como Next.js y Nest.js.',
 'JavaScript');

-- Usuario 7: Python para ciencia de datos
INSERT INTO responses (email, motivation, favorite_language) VALUES
('laura.torres@example.com', 
 'Vengo del mundo de data science y quiero aplicar mis conocimientos de Python en desarrollo web full stack.',
 'Python');

-- Usuario 8: JavaScript adicional
INSERT INTO responses (email, motivation, favorite_language) VALUES
('david.ramirez@example.com', 
 NULL,
 'JavaScript');

-- ============================================
-- Verificación de los datos insertados
-- ============================================

-- Ver todos los registros insertados
SELECT 
  id,
  email,
  CASE 
    WHEN motivation IS NULL THEN '(sin motivación)'
    ELSE LEFT(motivation, 50) || '...'
  END as motivation_preview,
  favorite_language,
  submitted_at
FROM responses
ORDER BY submitted_at DESC;

-- Estadísticas por lenguaje (para verificar)
SELECT 
  favorite_language,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM responses), 2) as percentage
FROM responses
GROUP BY favorite_language
ORDER BY count DESC;

-- Resumen
SELECT 
  COUNT(*) as total_responses,
  COUNT(motivation) as with_motivation,
  COUNT(*) - COUNT(motivation) as without_motivation
FROM responses;
