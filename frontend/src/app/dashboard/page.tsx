'use client'

import type { LanguageStats, ResponseEntity } from '@/services/api'
import { getCount, getRecent, getStats } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import BackLink from '../_components/BackLink'
import LanguageStatsCard from './_components/LanguageStatsCard'
import RecentUsersList from './_components/RecentUsersList'
import RefreshButton from './_components/RefreshButton'
import ResponseCounter from './_components/ResponseCounter'
import UserModal from './_components/UserModal'
import DashboardLoading from './loading'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  
  // Dashboard data
  const [totalCount, setTotalCount] = useState<number>(0)
  const [recentUsers, setRecentUsers] = useState<ResponseEntity[]>([])
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([])
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<ResponseEntity | null>(null)

  // Load dashboard data - Errores capturados por error.tsx
  const loadDashboardData = async () => {
    setLoading(true)

    // Cargar datos en paralelo - Si falla, error.tsx lo captura
    const [count, recent, stats] = await Promise.all([
      getCount(),
      getRecent(),
      getStats()
    ])

    setTotalCount(count.total)
    setRecentUsers(recent)
    setLanguageStats(stats)
    setLoading(false)
  }

  // Load on mount - Los errores son capturados por error.tsx boundary
  useEffect(() => {
    loadDashboardData().catch((err) => {
      console.error('Dashboard error:', err)
      throw err // Lanzar error para que error.tsx lo capture
    })
  }, [])

  // Usar componente Loading en lugar de skeleton duplicado
  if (loading) {
    return <DashboardLoading />
  }

  // Los errores son manejados por error.tsx boundary
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <BackLink href="/form">Volver al formulario</BackLink>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ir al inicio
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard de Respuestas
              </h1>
              <p className="text-gray-600">
                Estadísticas y respuestas recientes del formulario
              </p>
            </div>
            <RefreshButton onClick={loadDashboardData} variant="desktop" />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Component 1: Response Counter */}
          <ResponseCounter totalCount={totalCount} />

          {/* Component 3: Language Statistics */}
          <LanguageStatsCard languageStats={languageStats} totalCount={totalCount} />
        </div>

        {/* Component 2: Recent Users List */}
        <RecentUsersList recentUsers={recentUsers} onUserClick={setSelectedUser} />

        {/* Refresh button mobile */}
        <RefreshButton onClick={loadDashboardData} variant="mobile" />
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  )
}