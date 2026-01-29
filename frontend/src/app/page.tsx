import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Prueba Técnica Full Stack
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Formulario y Dashboard con Next.js, Express y PostgreSQL
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/form"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Formulario
              </h2>
              <p className="text-gray-600">
                Completa el formulario con tu información
              </p>
              <div className="text-purple-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                Ir al formulario
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h2>
              <p className="text-gray-600">
                Visualiza estadísticas y respuestas recientes
              </p>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                Ver dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stack Tecnológico
          </h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded-full">Next.js 14</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">React 18</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Tailwind CSS</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Express</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">PostgreSQL</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Docker</span>
          </div>
        </div>
      </main>
    </div>
  )
}
