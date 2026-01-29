const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/dev/backend'

export interface ResponseEntity {
  id: number
  email: string
  motivation: string | null
  favorite_language: string
  submitted_at: string
}

export interface LanguageStats {
  language: string
  count: number
}

export interface CreateResponseDTO {
  email: string
  motivation?: string | null
  favorite_language: string
}

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
 */
export async function getCount(): Promise<{ total: number }> {
  const response = await fetch(`${API_URL}/api/responses/count`)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/recent - Obtener últimas 5 respuestas
 */
export async function getRecent(): Promise<ResponseEntity[]> {
  const response = await fetch(`${API_URL}/api/responses/recent`)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * GET /api/responses/stats - Obtener estadísticas de lenguajes
 */
export async function getStats(): Promise<LanguageStats[]> {
  const response = await fetch(`${API_URL}/api/responses/stats`)
  
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
export async function checkEmail(email: string): Promise<{ exists: boolean }> {
  const response = await fetch(`${API_URL}/api/responses/check/${encodeURIComponent(email)}`)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}
