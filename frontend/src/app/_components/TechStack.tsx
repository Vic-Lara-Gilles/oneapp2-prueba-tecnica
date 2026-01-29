import { memo } from 'react'

interface TechStackProps {
  technologies: string[]
}

function TechStack({ technologies }: TechStackProps) {
  return (
    <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Stack Tecnológico
      </h3>
      <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
        {technologies.map((tech) => (
          <span 
            key={tech} 
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(TechStack)
