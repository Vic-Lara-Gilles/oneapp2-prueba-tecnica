import Link from 'next/link'
import { AnchorHTMLAttributes, ButtonHTMLAttributes, memo, ReactNode } from 'react'

/**
 * Button Variants
 * Context7: Tailwind CSS design system patterns
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

// Estilos base compartidos
const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

// Variantes de colores
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 disabled:bg-purple-300',
  secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
}

// Tamaños
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
}

/**
 * Button Component Props (HTMLButtonElement)
 */
interface ButtonProps extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  children: ReactNode
}

/**
 * Link Button Component Props (Link/Anchor)
 */
interface LinkButtonProps extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  as: 'link'
  href: string
  children: ReactNode
}

type CombinedButtonProps = ButtonProps | LinkButtonProps

/**
 * Button Component
 * 
 * Context7: Next.js component patterns - Polymorphic component
 * 
 * Componente de botón reutilizable que elimina duplicación de clases Tailwind.
 * Soporta múltiples variantes y puede renderizarse como button o Link de Next.js.
 * 
 * @example
 * // Botón primario
 * <Button variant="primary">Enviar</Button>
 * 
 * @example
 * // Botón como Link
 * <Button as="link" href="/" variant="outline">Inicio</Button>
 * 
 * @example
 * // Botón con tamaño y ancho completo
 * <Button variant="primary" size="lg" fullWidth>Continuar</Button>
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: CombinedButtonProps) {
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  if (props.as === 'link') {
    const { href, ...linkProps } = props
    // Remove 'as' from spread to avoid React warning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _, ...cleanProps } = linkProps
    return (
      <Link href={href} className={combinedClassName} {...cleanProps}>
        {children}
      </Link>
    )
  }

  // Remove 'as' from spread to avoid React warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _, ...buttonProps } = props as ButtonProps
  return (
    <button className={combinedClassName} {...buttonProps}>
      {children}
    </button>
  )
}

// Memoizar para prevenir re-renders innecesarios
export default memo(Button)
