import { memo } from 'react'

interface FormInputProps {
  id: string
  name: string
  label: string
  type?: 'text' | 'email'
  required?: boolean
  disabled?: boolean
  placeholder?: string
  error?: string
}

/**
 * FormInput Component
 * Context7: Reusable form input with validation display
 * Memoized to prevent unnecessary re-renders
 */
function FormInput({
  id,
  name,
  label,
  type = 'text',
  required = false,
  disabled = false,
  placeholder,
  error
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
        } focus:ring-2 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default memo(FormInput)
