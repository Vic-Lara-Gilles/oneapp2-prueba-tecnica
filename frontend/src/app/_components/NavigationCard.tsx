import Image from 'next/image'
import Link from 'next/link'

interface NavigationCardProps {
  href: string
  icon: string
  iconAlt: string
  title: string
  description: string
  linkText: string
  colorScheme: 'purple' | 'blue'
}

export default function NavigationCard({
  href,
  icon,
  iconAlt,
  title,
  description,
  linkText,
  colorScheme
}: NavigationCardProps) {
  const colors = {
    purple: {
      iconBg: 'bg-purple-100 group-hover:bg-purple-200',
      border: 'hover:border-purple-300',
      text: 'text-purple-600'
    },
    blue: {
      iconBg: 'bg-blue-100 group-hover:bg-blue-200',
      border: 'hover:border-blue-300',
      text: 'text-blue-600'
    }
  }

  const scheme = colors[colorScheme]

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 ${scheme.border}`}
    >
      <div className="space-y-4">
        <div className={`w-12 h-12 ${scheme.iconBg} rounded-full flex items-center justify-center transition-colors`}>
          <Image 
            src={icon}
            alt={iconAlt}
            width={24} 
            height={24}
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600">
          {description}
        </p>
        <div className={`${scheme.text} font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2`}>
          {linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
