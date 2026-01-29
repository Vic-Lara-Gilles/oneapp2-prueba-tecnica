import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

type ValidationTarget = 'body' | 'query' | 'params'

/**
 * Middleware para validar datos de entrada con Zod
 * @param schema - Schema de Zod para validación
 * @param target - Ubicación de los datos a validar (body, query, params)
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target]
      const validatedData = schema.parse(data)
      
      // Reemplazar datos originales con validados y transformados
      req[target] = validatedData
      
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
        
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: formattedErrors
        })
      }
      
      // Error inesperado
      next(error)
    }
  }
}
