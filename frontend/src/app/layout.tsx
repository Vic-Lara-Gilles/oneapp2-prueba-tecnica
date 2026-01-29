import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Prueba Técnica Full Stack",
    template: "%s | Prueba Técnica",
  },
  description: "Sistema de Formulario y Dashboard con Next.js, Express y PostgreSQL - Prueba Técnica Full Stack Developer",
  keywords: ["Next.js", "React", "TypeScript", "PostgreSQL", "Express", "Full Stack"],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "Prueba Técnica Full Stack",
    description: "Sistema de Formulario y Dashboard con Next.js, Express y PostgreSQL",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prueba Técnica Full Stack",
    description: "Sistema de Formulario y Dashboard con Next.js, Express y PostgreSQL",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
