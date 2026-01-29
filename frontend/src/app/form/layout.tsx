import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formulario',
  description: 'Completa el formulario con tu información - Prueba Técnica Full Stack',
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
