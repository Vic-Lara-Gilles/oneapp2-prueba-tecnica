'use client'

import Link from 'next/link'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
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
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="block w-full py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
