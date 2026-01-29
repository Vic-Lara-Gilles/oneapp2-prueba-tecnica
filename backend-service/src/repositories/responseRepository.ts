import { query } from '../services/database'
import type { CreateResponseDTO } from '../validators/responseValidator'

export interface ResponseEntity {
  id: number
  email: string
  motivation: string | null
  favorite_language: string
  submitted_at: Date
}

export interface LanguageStats {
  favorite_language: string
  count: string
}

/**
 * Repositorio para operaciones de base de datos con la tabla responses
 * Usa queries parametrizadas para prevenir SQL injection
 */
export const responseRepository = {
  /**
   * Crear nueva respuesta
   */
  async create(data: CreateResponseDTO): Promise<ResponseEntity> {
    const sql = `
      INSERT INTO responses (email, motivation, favorite_language)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const values = [data.email, data.motivation, data.favorite_language]
    const result = await query<ResponseEntity>(sql, values)
    return result.rows[0]
  },

  /**
   * Verificar si existe un email
   */
  async emailExists(email: string): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT 1 FROM responses WHERE email = $1) as exists`
    const result = await query<{ exists: boolean }>(sql, [email])
    return result.rows[0].exists
  },

  /**
   * Obtener conteo total de respuestas
   */
  async getCount(): Promise<number> {
    const sql = `SELECT COUNT(*) as total FROM responses`
    const result = await query<{ total: string }>(sql)
    return parseInt(result.rows[0].total, 10)
  },

  /**
   * Obtener respuestas recientes (últimas N)
   */
  async getRecent(limit: number = 5): Promise<ResponseEntity[]> {
    const sql = `
      SELECT id, email, motivation, favorite_language, submitted_at
      FROM responses
      ORDER BY submitted_at DESC
      LIMIT $1
    `
    const result = await query<ResponseEntity>(sql, [limit])
    return result.rows
  },

  /**
   * Obtener estadísticas de lenguajes (agregación en BD)
   */
  async getLanguageStats(): Promise<LanguageStats[]> {
    const sql = `
      SELECT favorite_language, COUNT(*) as count
      FROM responses
      GROUP BY favorite_language
      ORDER BY count DESC
    `
    const result = await query<LanguageStats>(sql)
    return result.rows
  },

  /**
   * Obtener respuesta por email
   */
  async findByEmail(email: string): Promise<ResponseEntity | null> {
    const sql = `
      SELECT id, email, motivation, favorite_language, submitted_at
      FROM responses 
      WHERE email = $1
    `
    const result = await query<ResponseEntity>(sql, [email])
    return result.rows[0] || null
  },

  /**
   * Obtener todas las respuestas
   */
  async findAll(): Promise<ResponseEntity[]> {
    const sql = `
      SELECT id, email, motivation, favorite_language, submitted_at
      FROM responses
      ORDER BY submitted_at DESC
    `
    const result = await query<ResponseEntity>(sql)
    return result.rows
  }
}
