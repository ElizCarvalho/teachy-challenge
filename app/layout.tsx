import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Teachy - Sistema de Autenticação',
  description: 'Sistema de autenticação e gerenciamento de sessões para a plataforma Teachy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}