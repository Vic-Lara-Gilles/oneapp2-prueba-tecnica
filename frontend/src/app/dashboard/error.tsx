'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error en el Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          No se pudieron cargar las estadísticas. El servidor puede no estar disponible.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/form"
            className="block w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Ir al formulario
          </Link>
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
