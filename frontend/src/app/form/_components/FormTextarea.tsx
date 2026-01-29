import { memo } from 'react'

interface FormTextareaProps {
  id: string
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  rows?: number
  maxLength?: number
  error?: string
  helperText?: string
}

/**
 * FormTextarea Component
 * Context7: Reusable textarea with validation and character limit
 * Memoized to prevent unnecessary re-renders
 */
function FormTextarea({
  id,
  name,
  label,
  required = false,
  disabled = false,
  placeholder,
  rows = 5,
  maxLength,
  error,
  helperText
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400">(Opcional)</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && (
        <p className="mt-2 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default memo(FormTextarea)
