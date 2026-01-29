import { NextFunction, Request, Response } from 'express'
import { ConflictError, NotFoundError } from '../middleware/errorHandler'
import { responseRepository } from '../repositories/responseRepository'
import type { CreateResponseDTO } from '../validators/responseValidator'

/**
 * Controladores para los endpoints de responses
 */
export const responseController = {
  /**
   * POST /api/responses - Crear nueva respuesta
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateResponseDTO = req.body

      // Verificar email duplicado
      const exists = await responseRepository.emailExists(data.email)
      if (exists) {
        throw new ConflictError('Este email ya ha respondido el formulario')
      }

      const response = await responseRepository.create(data)
      
      res.status(201).json(response)
    } catch (error: any) {
      // Manejar error de constraint único de PostgreSQL
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Este email ya ha respondido el formulario'
        })
      }
      next(error)
    }
  },

  /**
   * GET /api/responses/count - Obtener conteo total
   */
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await responseRepository.getCount()
      res.json({ total })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/responses/recent - Obtener últimas 5 respuestas
   */
  async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await responseRepository.getRecent(5)
      res.json(responses)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/responses/stats - Obtener estadísticas de lenguajes
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await responseRepository.getLanguageStats()
      
      // Transformar count de string a number
      const formattedStats = stats.map(s => ({
        language: s.favorite_language,
        count: parseInt(s.count, 10)
      }))
      
      res.json(formattedStats)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/responses/:email - Obtener respuesta por email
   */
  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params
      const response = await responseRepository.findByEmail(email)
      
      if (!response) {
        throw new NotFoundError('Respuesta no encontrada')
      }
      
      res.json(response)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/responses/check/:email - Verificar si email existe
   */
  async checkEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params
      const exists = await responseRepository.emailExists(email)
      res.json({ exists })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/responses - Obtener todas las respuestas (para admin)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await responseRepository.findAll()
      res.json(responses)
    } catch (error) {
      next(error)
    }
  }
}
