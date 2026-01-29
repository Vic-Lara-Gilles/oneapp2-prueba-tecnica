import type { LanguageStats } from '@/services/api'
import { memo } from 'react'

interface LanguageStatsProps {
  languageStats: LanguageStats[]
  totalCount: number
}

function LanguageStatsCard({ languageStats, totalCount }: LanguageStatsProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Lenguajes Favoritos
        </h2>
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      {languageStats.length > 0 ? (
        <div className="space-y-4">
          {languageStats.map((stat) => {
            const percentage = totalCount > 0 ? (stat.count / totalCount) * 100 : 0
            return (
              <div key={stat.language}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{stat.language}</span>
                  <span className="text-sm text-gray-600">
                    {stat.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No hay datos de lenguajes disponibles
        </p>
      )}
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(LanguageStatsCard)
