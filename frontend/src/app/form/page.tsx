'use client'

import { submitResponse, type FormState } from '@/app/actions/form'
import Link from 'next/link'
import { useFormState } from 'react-dom'

const initialState: FormState = {
  success: undefined,
  message: undefined,
  errors: undefined
}

export default function FormPage() {
  const [state, formAction] = useFormState(submitResponse, initialState)
  const pending = false // useFormState doesn't provide pending directly in React 18

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Formulario de Respuesta
          </h1>
          <p className="text-gray-600">
            Completa la información solicitada a continuación
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form action={formAction} className="space-y-6">
            {/* Email Field (REQUIRED) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={pending}
                className={`w-full px-4 py-3 rounded-lg border ${
                  state.errors?.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="tu@email.com"
              />
              {state.errors?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Motivation Field (OPTIONAL) */}
            <div>
              <label htmlFor="motivation" className="block text-sm font-semibold text-gray-900 mb-2">
                ¿Qué te motivó a aplicar a esta posición? <span className="text-gray-400">(Opcional)</span>
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={5}
                maxLength={1000}
                disabled={pending}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                placeholder="Escribe tu motivación aquí (máximo 1000 caracteres)..."
              />
              {state.errors?.motivation && (
                <p className="mt-2 text-sm text-red-600">
                  {state.errors.motivation[0]}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Este campo es opcional
              </p>
            </div>

            {/* Favorite Language Field (REQUIRED) */}
            <div>
              <label htmlFor="favorite_language" className="block text-sm font-semibold text-gray-900 mb-2">
                ¿Cuál es tu lenguaje de programación favorito? <span className="text-red-500">*</span>
              </label>
              <select
                id="favorite_language"
                name="favorite_language"
                required
                disabled={pending}
                className={`w-full px-4 py-3 rounded-lg border ${
                  state.errors?.favorite_language 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="">Selecciona una opción</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
                <option value="Otro">Otro</option>
              </select>
              {state.errors?.favorite_language && (
                <p className="mt-2 text-sm text-red-600">
                  {state.errors.favorite_language[0]}
                </p>
              )}
            </div>

            {/* Success/Error Messages */}
            {state.message && (
              <div className={`p-4 rounded-lg ${
                state.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {state.success ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${
                    state.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {state.message}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar formulario
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Success Action */}
            {state.success && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/dashboard"
                  className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Ver Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </Link>
              </div>
            )}
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
