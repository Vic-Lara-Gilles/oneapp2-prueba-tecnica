import Link from 'next/link'
import { memo } from 'react'

interface BackLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * BackLink Component
 * Context7: Reusable navigation link with back arrow
 * Used across pages for consistent navigation UX
 * Memoized to prevent unnecessary re-renders
 */
function BackLink({ href, children, className = '' }: BackLinkProps) {
  return (
    <Link 
      href={href}
      className={`inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </Link>
  )
}

export default memo(BackLink)
