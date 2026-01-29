import { memo } from 'react'

interface FormSelectProps {
  id: string
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  options: Array<{ value: string; label: string }>
  error?: string
  placeholder?: string
}

/**
 * FormSelect Component
 * Context7: Reusable select dropdown with validation
 * Memoized to prevent unnecessary re-renders
 */
function FormSelect({
  id,
  name,
  label,
  required = false,
  disabled = false,
  options,
  error,
  placeholder = 'Selecciona una opción'
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        disabled={disabled}
        className={`w-full px-4 py-5 rounded-lg border text-gray-900 text-base ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
        } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default memo(FormSelect)
