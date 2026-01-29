import { memo } from 'react'
import Card from './Card'

interface ErrorContainerProps {
  children: React.ReactNode
}

/**
 * ErrorContainer Component
 * 
 * Context7: Next.js error handling patterns
 * 
 * Contenedor estándar para páginas de error (error.tsx, not-found.tsx).
 * Centraliza el layout de gradiente y la tarjeta elevada.
 * 
 * @example
 * <ErrorContainer>
 *   <ErrorIcon />
 *   <h2>Error Title</h2>
 *   <p>Error message</p>
 *   <Button>Action</Button>
 * </ErrorContainer>
 */
function ErrorContainer({ children }: ErrorContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full text-center">
        {children}
      </Card>
    </div>
  )
}

// Memoizar para prevenir re-renders innecesarios
export default memo(ErrorContainer)
