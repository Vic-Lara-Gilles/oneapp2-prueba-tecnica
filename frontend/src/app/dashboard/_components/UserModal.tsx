'use client'

import { Button } from '@/components/ui'
import type { ResponseEntity } from '@/services/api'
import { memo, useEffect } from 'react'

interface UserModalProps {
  user: ResponseEntity | null
  onClose: () => void
}

/**
 * Modal para mostrar la motivación del usuario seleccionado
 * Componente privado del Dashboard (colocation pattern)
 * Memoizado para optimizar performance
 */
function UserModal({ user, onClose }: UserModalProps) {
  // Cerrar modal con ESC (Context7: Accessibility best practices)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && user) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [user, onClose])

  if (!user) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-1">
                Respuesta de Usuario
              </h3>
              <p className="text-purple-100 text-sm">
                {user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fecha de envío */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de envío
            </label>
            <p className="text-gray-900">
              {new Date(user.submitted_at).toLocaleString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Lenguaje favorito */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lenguaje de programación favorito
            </label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {user.favorite_language}
            </span>
          </div>

          {/* Motivación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivación
            </label>
            {user.motivation ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {user.motivation}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500 italic">
                  Sin motivación proporcionada
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <Button onClick={onClose} variant="primary" size="sm" fullWidth>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(UserModal)
