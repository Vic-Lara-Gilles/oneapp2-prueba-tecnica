import { Button, ErrorContainer } from '@/components/ui'

export default function NotFound() {
  return (
    <ErrorContainer>
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
        <Button as="link" href="/" variant="primary" size="md" fullWidth>
          Volver al inicio
        </Button>
        <div className="flex gap-3">
          <Button as="link" href="/form" variant="outline" size="md" className="flex-1">
            Formulario
          </Button>
          <Button as="link" href="/dashboard" variant="outline" size="md" className="flex-1">
            Dashboard
          </Button>
        </div>
      </div>
    </ErrorContainer>
  )
}
