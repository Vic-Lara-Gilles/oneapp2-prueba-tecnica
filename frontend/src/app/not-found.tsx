import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-purple-600">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
          >
            Volver al inicio
          </Link>
          <div className="flex gap-3">
            <Link
              href="/form"
              className="flex-1 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Formulario
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
