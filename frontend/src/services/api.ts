import type {
  CountResponse,
  CreateResponseDTO,
  EmailCheckResponse,
  LanguageStats,
  ResponseEntity
} from './api.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/dev/backend'

/**
 * POST /api/responses - Crear nueva respuesta
 */
export async function createResponse(data: CreateResponseDTO): Promise<ResponseEntity> {
  const response = await fetch(`${API_URL}/api/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/count - Obtener conteo total
 * Context7: Next.js fetch with cache revalidation
 */
export async function getCount(): Promise<CountResponse> {
  const response = await fetch(`${API_URL}/api/responses/count`, {
    next: { revalidate: 10 }, // Revalidar cada 10 segundos
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/recent - Obtener últimas 5 respuestas
 * Context7: Next.js fetch with cache revalidation
 */
export async function getRecent(): Promise<ResponseEntity[]> {
  const response = await fetch(`${API_URL}/api/responses/recent`, {
    next: { revalidate: 10 }, // Revalidar cada 10 segundos
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/stats - Obtener estadísticas de lenguajes
 * Context7: Next.js fetch with cache revalidation
 */
export async function getStats(): Promise<LanguageStats[]> {
  const response = await fetch(`${API_URL}/api/responses/stats`, {
    next: { revalidate: 10 }, // Revalidar cada 10 segundos
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/:email - Obtener respuesta por email
 */
export async function getByEmail(email: string): Promise<ResponseEntity> {
  const response = await fetch(`${API_URL}/api/responses/${encodeURIComponent(email)}`)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/check/:email - Verificar si email existe
 */
export async function checkEmail(email: string): Promise<EmailCheckResponse> {
  const response = await fetch(`${API_URL}/api/responses/check/${encodeURIComponent(email)}`)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

// Re-export types for convenience
export type {
  CountResponse, CreateResponseDTO, EmailCheckResponse, LanguageStats, ResponseEntity
} from './api.types'

