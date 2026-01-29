'use client'

import { Button, ErrorContainer } from '@/components/ui'
import { useEffect } from 'react'

export default function FormError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Form Error:', error)
  }, [error])

  return (
    <ErrorContainer>
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Error en el formulario
      </h2>
      <p className="text-gray-600 mb-6">
        No se pudo cargar el formulario. Verifica tu conexión e intenta de nuevo.
      </p>
      <div className="space-y-3">
        <Button onClick={reset} variant="primary" size="md" fullWidth>
          Reintentar
        </Button>
        <Button as="link" href="/" variant="outline" size="md" fullWidth>
          Volver al inicio
        </Button>
      </div>
    </ErrorContainer>
  )
}
