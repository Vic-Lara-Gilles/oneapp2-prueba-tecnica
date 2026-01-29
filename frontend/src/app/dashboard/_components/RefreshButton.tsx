import { memo } from 'react'

interface RefreshButtonProps {
  onClick: () => void
  variant?: 'desktop' | 'mobile'
}

function RefreshButton({ onClick, variant = 'desktop' }: RefreshButtonProps) {
  const baseClasses = "flex items-center gap-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md transition-colors border border-gray-200"
  
  const variantClasses = {
    desktop: "hidden sm:flex py-2",
    mobile: "sm:hidden mt-6 w-full justify-center py-3"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {variant === 'desktop' ? 'Actualizar' : 'Actualizar datos'}
    </button>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(RefreshButton)
