'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CallbackProcessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('Iniciando processamento de autenticação...')
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    const fullUrl = window.location.href;
    const searchParamsObj = Object.fromEntries(
      Array.from(searchParams.entries())
    );
    
    console.log('URL completa de callback:', fullUrl);
    console.log('Parâmetros de consulta:', searchParamsObj);
    
    setDebugInfo(`URL: ${fullUrl}\nParâmetros: ${JSON.stringify(searchParamsObj, null, 2)}`);
    
    const code = searchParams.get('code')
    
    const processCallback = async () => {
      try {
        setStatus('Código de autorização recebido: ' + code)
        
        console.log('Chamando API de callback com código:', code);
        
        const callbackUrl = `/api/auth/callback?code=${code}`;
        console.log('URL da API de callback:', callbackUrl);
        
        const callbackResponse = await fetch(callbackUrl, {
          headers: {
            'Accept': 'application/json',
            'X-Debug-Info': 'callback-page'
          }
        });
        
        console.log('Status da resposta de callback:', callbackResponse.status);
        
        let responseText = '';
        try {
          responseText = await callbackResponse.text();
          console.log('Corpo da resposta:', responseText);
        } catch (textError) {
          console.error('Erro ao obter texto da resposta:', textError);
        }
        
        if (!callbackResponse.ok) {
          setError(`Erro no processamento do callback: ${callbackResponse.status} - ${responseText}`);
          return;
        }
        
        setStatus('Autenticação bem-sucedida! Redirecionando...');
        
        const redirectUri = sessionStorage.getItem('redirectUri') || '/dashboard';
        console.log('Redirecionando para:', redirectUri);
        sessionStorage.removeItem('redirectUri');
        router.push(redirectUri);
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(`Falha na autenticação: ${err.message}. Por favor, tente novamente.`);
      }
    }

    if (searchParams.get('code')) {
      processCallback();
    } else {
      setError('Nenhum código de autorização encontrado nos parâmetros da URL');
    }
  }, [router, searchParams]);

  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">Autenticação</h1>
      
      {debugInfo && (
        <div className="p-4 mb-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          <p className="font-bold mb-1">Informações de Depuração:</p>
          <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-40">
            {debugInfo}
          </pre>
        </div>
      )}
      
      {error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          <p className="font-bold mb-1">Erro:</p>
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-center">{status}</p>
        </>
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={() => window.location.href = '/login'}
          className="text-blue-600 hover:underline"
        >
          Voltar para a página de login
        </button>
      </div>
    </div>
  )
}

function CallbackLoading() {
  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">Autenticação</h1>
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <p className="text-center">Carregando...</p>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<CallbackLoading />}>
        <CallbackProcessor />
      </Suspense>
    </div>
  )
}