import { memo } from 'react'

interface SubmitButtonProps {
  pending: boolean
  children: string
}

/**
 * SubmitButton Component
 * Context7: Form submit button with loading state
 * Shows spinner and "Enviando..." text when pending
 * Memoized to prevent unnecessary re-renders
 */
function SubmitButton({ pending, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enviando...
        </>
      ) : (
        <>
          {children}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  )
}

export default memo(SubmitButton)
