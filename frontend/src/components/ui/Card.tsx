import { HTMLAttributes, memo } from 'react'

/**
 * Card Variants
 * Context7: Tailwind CSS design system patterns
 */
type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  children: React.ReactNode
}

// Estilos base
const baseStyles = 'bg-white rounded-2xl'

// Variantes de Card
const variantStyles: Record<CardVariant, string> = {
  default: 'shadow-lg',
  elevated: 'shadow-xl',
  bordered: 'shadow-lg border border-gray-200',
  interactive: 'shadow-lg border border-gray-200 hover:shadow-xl transition-shadow',
}

// Padding interno
const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * Card Component
 * 
 * Context7: Next.js component patterns - Design System
 * 
 * Componente de tarjeta reutilizable para eliminar duplicación de estilos.
 * Usado en Dashboard, páginas de error, formularios, etc.
 * 
 * @example
 * // Card interactiva con padding mediano
 * <Card variant="interactive" padding="md">
 *   <h2>Título</h2>
 *   <p>Contenido...</p>
 * </Card>
 * 
 * @example
 * // Card elevada para modales
 * <Card variant="elevated" padding="lg">
 *   <form>...</form>
 * </Card>
 */
function Card({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

// Memoizar para prevenir re-renders innecesarios
export default memo(Card)
