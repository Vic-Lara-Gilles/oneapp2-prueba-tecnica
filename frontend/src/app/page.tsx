import NavigationCard from './_components/NavigationCard'
import TechStack from './_components/TechStack'

const technologies = [
  'Next.js 14',
  'React 18',
  'TypeScript',
  'Tailwind CSS',
  'Express',
  'PostgreSQL',
  'Docker'
]

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
          <NavigationCard
            href="/form"
            icon="/file.svg"
            iconAlt="Formulario"
            title="Formulario"
            description="Completa el formulario con tu información"
            linkText="Ir al formulario"
            colorScheme="purple"
          />

          <NavigationCard
            href="/dashboard"
            icon="/globe.svg"
            iconAlt="Dashboard"
            title="Dashboard"
            description="Visualiza estadísticas y respuestas recientes"
            linkText="Ver dashboard"
            colorScheme="blue"
          />
        </div>

        <TechStack technologies={technologies} />
      </main>
    </div>
  )
}
