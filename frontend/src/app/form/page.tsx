'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import BackLink from '../_components/BackLink'
import FormInput from './_components/FormInput'
import FormMessage from './_components/FormMessage'
import FormSelect from './_components/FormSelect'
import FormTextarea from './_components/FormTextarea'
import SubmitButton from './_components/SubmitButton'
import { submitResponse, type FormState } from './actions'

const initialState: FormState = {
  success: undefined,
  message: undefined,
  errors: undefined
}

export default function FormPage() {
  const [state, formAction] = useFormState(submitResponse, initialState)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  // Wrapper para manejar el estado de pending manualmente
  const handleSubmit = (formData: FormData) => {
    setPending(true)
    formAction(formData)
  }

  // Resetear pending cuando el estado cambia
  useEffect(() => {
    if (state.success !== undefined && pending) {
      setPending(false)
    }
  }, [state, pending])

  // Redirigir al dashboard inmediatamente cuando el formulario se envía exitosamente
  useEffect(() => {
    if (state.success === true) {
      router.push('/dashboard')
    }
  }, [state.success, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <BackLink href="/">Volver al inicio</BackLink>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Formulario de Respuesta
          </h1>
          <p className="text-gray-600">
            Completa la información solicitada a continuación
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form action={handleSubmit} className="space-y-6">
              {/* Email Field (REQUIRED) */}
              <FormInput
                id="email"
                name="email"
                label="Email"
                type="email"
                required
                disabled={pending}
                placeholder="tu@email.com"
                error={state.errors?.email?.[0]}
              />

              {/* Motivation Field (OPTIONAL) */}
              <FormTextarea
                id="motivation"
                name="motivation"
                label="¿Qué te motivó a aplicar a esta posición?"
                disabled={pending}
                rows={5}
                maxLength={1000}
                placeholder="Escribe tu motivación aquí (máximo 1000 caracteres)..."
                error={state.errors?.motivation?.[0]}
                helperText="Este campo es opcional"
              />

              {/* Favorite Language Field (REQUIRED) */}
              <FormSelect
                id="favorite_language"
                name="favorite_language"
                label="¿Cuál es tu lenguaje de programación favorito?"
                required
                disabled={pending}
                options={[
                  { value: 'JavaScript', label: 'JavaScript' },
                  { value: 'Python', label: 'Python' },
                  { value: 'Java', label: 'Java' },
                  { value: 'C#', label: 'C#' },
                  { value: 'Otro', label: 'Otro' }
                ]}
                error={state.errors?.favorite_language?.[0]}
              />

              {/* Success/Error Messages */}
              {state.message && (
                <FormMessage 
                  message={state.message} 
                  type={state.success ? 'success' : 'error'} 
                />
              )}

              {/* Submit Button */}
              <SubmitButton pending={pending}>
                Enviar formulario
              </SubmitButton>
            </form>
          </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Los campos marcados con <span className="text-red-500">*</span> son obligatorios</p>
        </div>
      </div>
    </div>
  )
}