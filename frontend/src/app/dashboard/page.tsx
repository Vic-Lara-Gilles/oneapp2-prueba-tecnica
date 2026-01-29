'use client'

import type { LanguageStats, ResponseEntity } from '@/services/api'
import { getCount, getRecent, getStats } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LanguageStatsCard from './_components/LanguageStatsCard'
import RecentUsersList from './_components/RecentUsersList'
import ResponseCounter from './_components/ResponseCounter'
import UserModal from './_components/UserModal'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dashboard data
  const [totalCount, setTotalCount] = useState<number>(0)
  const [recentUsers, setRecentUsers] = useState<ResponseEntity[]>([])
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([])
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<ResponseEntity | null>(null)

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar datos en paralelo
      const [count, recent, stats] = await Promise.all([
        getCount(),
        getRecent(),
        getStats()
      ])

      setTotalCount(count.total)
      setRecentUsers(recent)
      setLanguageStats(stats)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Load on mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Loading state - Skeleton profesional
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-10 bg-gray-200 rounded w-96 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
              </div>
              <div className="hidden sm:block h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Dashboard Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Counter Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Stats Skeleton - spans 2 columns on lg */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/form"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al formulario
            </Link>
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
            <button
              onClick={loadDashboardData}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
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
        <button
          onClick={loadDashboardData}
          className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md transition-colors border border-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar datos
        </button>
      </div>

      {/* User Modal */}
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}
