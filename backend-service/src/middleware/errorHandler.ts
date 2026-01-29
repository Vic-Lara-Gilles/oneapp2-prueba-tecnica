import { NextFunction, Request, Response } from 'express'

interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Middleware centralizado de manejo de errores
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error capturado:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
    statusCode: error.statusCode
  })

  const statusCode = error.statusCode || 500
  const message = error.isOperational 
    ? error.message 
    : 'Error interno del servidor'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  })
}

/**
 * Clase para errores operacionales (errores esperados del negocio)
 */
export class OperationalError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.name = 'OperationalError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Helper para crear error 404
 */
export class NotFoundError extends OperationalError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Helper para crear error 409 (conflict)
 */
export class ConflictError extends OperationalError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

/**
 * Helper para crear error 400 (bad request)
 */
export class BadRequestError extends OperationalError {
  constructor(message: string = 'Solicitud inválida') {
    super(message, 400)
    this.name = 'BadRequestError'
  }
}
