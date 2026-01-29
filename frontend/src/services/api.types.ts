// API Response Types
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

// API Request Types
export interface CreateResponseDTO {
  email: string
  motivation?: string | null
  favorite_language: string
}

// API Response Wrappers
export interface CountResponse {
  total: number
}

export interface EmailCheckResponse {
  exists: boolean
}
