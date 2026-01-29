import { z } from 'zod'

// Schema para crear respuesta
export const createResponseSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Formato de email inválido' })
    .max(255, { message: 'El email es demasiado largo' })
    .toLowerCase()
    .trim(),
    
  motivation: z
    .string()
    .max(1000, { message: 'La motivación no puede exceder 1000 caracteres' })
    .optional()
    .nullable()
    .transform(val => val === '' || val === null || val === undefined ? null : val),
    
  favorite_language: z.enum(['JavaScript', 'Python', 'Java', 'C#', 'Otro'])
})

// Schema para parámetro email
export const emailParamSchema = z.object({
  email: z
    .string()
    .email({ message: 'Formato de email inválido' })
})

// Tipos inferidos
export type CreateResponseDTO = z.infer<typeof createResponseSchema>
export type EmailParam = z.infer<typeof emailParamSchema>
