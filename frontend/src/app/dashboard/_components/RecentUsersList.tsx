import type { ResponseEntity } from '@/services/api'
import { memo } from 'react'

interface RecentUsersListProps {
  recentUsers: ResponseEntity[]
  onUserClick: (user: ResponseEntity) => void
}

function RecentUsersList({ recentUsers, onUserClick }: RecentUsersListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Respuestas Recientes
        </h2>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
      {recentUsers.length > 0 ? (
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserClick(user)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(user.submitted_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {user.favorite_language}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No hay respuestas recientes
        </p>
      )}
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(RecentUsersList)
