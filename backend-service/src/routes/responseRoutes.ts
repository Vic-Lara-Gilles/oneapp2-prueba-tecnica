import { Router } from 'express'
import { responseController } from '../controllers/responseController'
import { validate } from '../middleware/validation'
import { createResponseSchema, emailParamSchema } from '../validators/responseValidator'

const router = Router()

/**
 * POST /api/responses - Crear nueva respuesta
 * Body: { email, motivation?, favorite_language }
 */
router.post(
  '/',
  validate(createResponseSchema, 'body'),
  responseController.create
)

/**
 * GET /api/responses/count - Obtener conteo total
 * Response: { total: number }
 */
router.get('/count', responseController.getCount)

/**
 * GET /api/responses/recent - Obtener últimas 5 respuestas
 * Response: ResponseEntity[]
 */
router.get('/recent', responseController.getRecent)

/**
 * GET /api/responses/stats - Obtener estadísticas por lenguaje
 * Response: { language: string, count: number }[]
 */
router.get('/stats', responseController.getStats)

/**
 * GET /api/responses/check/:email - Verificar si email existe
 * Response: { exists: boolean }
 */
router.get(
  '/check/:email',
  validate(emailParamSchema, 'params'),
  responseController.checkEmail
)

/**
 * GET /api/responses/:email - Obtener respuesta por email
 * Response: ResponseEntity
 */
router.get(
  '/:email',
  validate(emailParamSchema, 'params'),
  responseController.getByEmail
)

/**
 * GET /api/responses - Obtener todas las respuestas
 * Response: ResponseEntity[]
 */
router.get('/', responseController.getAll)

export default router
