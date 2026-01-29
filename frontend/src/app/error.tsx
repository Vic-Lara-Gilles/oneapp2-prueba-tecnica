'use client'

import { Button, ErrorContainer } from '@/components/ui'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <ErrorContainer>
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        ¡Ocurrió un error!
      </h2>
      <p className="text-gray-600 mb-6">
        {error.message || 'Ha ocurrido un error inesperado'}
      </p>
      <div className="space-y-3">
        <Button onClick={reset} variant="primary" size="md" fullWidth>
          Intentar de nuevo
        </Button>
        <Button as="link" href="/" variant="outline" size="md" fullWidth>
          Volver al inicio
        </Button>
      </div>
    </ErrorContainer>
  )
}
