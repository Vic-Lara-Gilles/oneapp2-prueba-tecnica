import { memo } from 'react'

interface ResponseCounterProps {
  totalCount: number
}

function ResponseCounter({ totalCount }: ResponseCounterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Total de Respuestas
        </h2>
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      <div className="text-5xl font-bold text-purple-600 mb-2">
        {totalCount}
      </div>
      <p className="text-sm text-gray-500">
        {totalCount === 1 ? 'persona ha respondido' : 'personas han respondido'}
      </p>
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(ResponseCounter)
