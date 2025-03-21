'use client'

import { useAuth } from '../components/AuthProvider'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TeachyBackground from '../components/TeachyBackground'
import React, { Suspense } from 'react'

function ErrorMessageHandler() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      switch (error) {
        case 'server_error':
          setErrorMessage('Erro no servidor de autenticação. Tente novamente mais tarde.')
          break
        case 'token_exchange':
          setErrorMessage('Erro ao processar o token de autenticação. Tente novamente.')
          break
        case 'missing_code':
          setErrorMessage('Código de autorização ausente. Tente novamente.')
          break
        default:
          setErrorMessage(`Erro durante autenticação: ${error}`)
      }
    }
  }, [searchParams])

  if (errorMessage) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md mb-4">
        {errorMessage}
      </div>
    )
  }

  return null
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function Login() {
  const { user, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<string | null>(null)


  useEffect(() => {
    if (user && !isLoading) {
      window.location.href = '/dashboard'
    }
  }, [user, isLoading])

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID
    const zitadelUrl = process.env.NEXT_PUBLIC_ZITADEL_URL
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const redirectUri = `${appUrl}/auth/callback`
    
    const authUrl = `${zitadelUrl}/oauth/v2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid profile email`
    
    sessionStorage.setItem('redirectUri', '/dashboard')
    
    try {
      // Primeiro tente o método normal
      window.location.href = authUrl
      
      // Se o método acima não redirecionar imediatamente, use um método alternativo
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = authUrl;
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    } catch (error) {
      console.error('Erro ao redirecionar:', error);
      setDebugInfo(`Erro ao redirecionar: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (isLoading) {
    return (
      <TeachyBackground>
        <LoadingSpinner />
      </TeachyBackground>
    )
  }

  return (
    <TeachyBackground>
      <div className="flex min-h-screen">
        {/* Lado esquerdo - Formulário de login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Bem vindo!</h1>
            <p className="text-gray-600 mb-8">Agora sua vida escolar vai ficar muito mais fácil</p>
            
            <Suspense fallback={<div>Carregando...</div>}>
              <ErrorMessageHandler />
            </Suspense>
            
            {debugInfo && (
              <div className="p-4 mb-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 whitespace-pre-wrap">
                <p className="font-bold mb-2">Informações de Depuração:</p>
                <p className="text-xs font-mono">{debugInfo}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  />
                </svg>
                Continuar com Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeachyBackground>
  )
}