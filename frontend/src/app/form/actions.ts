'use server'

import { createResponse } from '@/services/api'
import { z } from 'zod'

// Zod schema para validación del formulario (Context7: Zod safeParse pattern)
const formSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  motivation: z.string()
    .max(1000, 'La motivación no puede exceder 1000 caracteres')
    .optional()
    .nullable(),
  favorite_language: z.string()
    .min(1, 'Debes seleccionar un lenguaje de programación')
    .refine(
      (val) => ['JavaScript', 'Python', 'Java', 'C#', 'Otro'].includes(val),
      { message: 'Debes seleccionar un lenguaje de programación válido' }
    )
})

export type FormState = {
  success?: boolean
  message?: string
  errors?: {
    email?: string[]
    motivation?: string[]
    favorite_language?: string[]
  }
}

/**
 * Server Action para enviar respuestas del formulario
 * Context7: Next.js 14 useActionState pattern
 */
export async function submitResponse(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extraer datos del FormData
    const rawData = {
      email: formData.get('email'),
      motivation: formData.get('motivation') || null,
      favorite_language: formData.get('favorite_language')
    }

    // Validar con Zod (Context7: safeParse pattern)
    const validatedFields = formSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Error de validación',
        errors: validatedFields.error.flatten().fieldErrors
      }
    }

    // Llamar al API
    await createResponse(validatedFields.data)

    return {
      success: true,
      message: '¡Formulario enviado exitosamente!'
    }
  } catch (error: unknown) {
    // Manejar error 409 (email duplicado)
    if (error instanceof Error) {
      if (error.message.includes('409') || error.message.includes('ya ha respondido')) {
        return {
          success: false,
          message: 'Este email ya ha respondido el formulario',
          errors: {
            email: ['Este email ya ha respondido el formulario']
          }
        }
      }
      
      return {
        success: false,
        message: error.message || 'Error al enviar el formulario'
      }
    }

    return {
      success: false,
      message: 'Error desconocido al enviar el formulario'
    }
  }
}
