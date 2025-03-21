'use client'

import { useAuth } from '../components/AuthProvider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TeachyBackground from '../components/TeachyBackground'

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const safeText = (text: any, fallback = 'Não disponível') => text || fallback;

  if (isLoading) {
    return (
      <TeachyBackground>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeachyBackground>
    )
  }

  if (!user) {
    return null
  }

  return (
    <TeachyBackground>
      <div className="flex min-h-screen pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-tr-2xl rounded-br-2xl shadow-lg hidden md:block p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{safeText(user.name)}</p>
                <p className="text-xs text-gray-500">{safeText(user.email)}</p>
              </div>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600">
                    <span className="text-xl">🏠</span>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">🧑‍🎓</span>
                    <span>Meu Perfil</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">📚</span>
                    <span>Cursos</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">📋</span>
                    <span>Tarefas</span>
                  </a>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <a href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <span className="text-xl">⚙️</span>
                      <span>Administração</span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
            
            <div className="mt-auto">
              <button 
                onClick={logout} 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full"
              >
                <span className="text-xl">🚪</span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Bem-vindo, {safeText(user.name).split(' ')[0]}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Seu Perfil</h2>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                >
                  {showDetails ? 'Esconder' : 'Detalhes'}
                </button>
              </div>
              
              <div className="space-y-2">
                <p><span className="font-medium">Nome:</span> {safeText(user.name)}</p>
                <p><span className="font-medium">Email:</span> {safeText(user.email)}</p>
                <p><span className="font-medium">Função:</span> {safeText(user.role)}</p>
                <p><span className="font-medium">Escolas:</span> {user.schools?.length ? user.schools.join(', ') : 'Nenhuma escola associada'}</p>
                
                {showDetails && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 overflow-auto">
                    <h3 className="text-md font-medium mb-2">Informações Completas:</h3>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Próximas Aulas</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">📚</span>
                  <div>
                    <p className="font-medium">Matemática</p>
                    <p className="text-xs text-gray-500">Hoje, 14:00 - 15:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-xl">🧪</span>
                  <div>
                    <p className="font-medium">Ciências</p>
                    <p className="text-xs text-gray-500">Amanhã, 10:30 - 12:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-xl">🌎</span>
                  <div>
                    <p className="font-medium">Geografia</p>
                    <p className="text-xs text-gray-500">Quinta, 08:00 - 09:30</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Tarefas Pendentes</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📝</span>
                    <p className="font-medium">Trabalho de História</p>
                  </div>
                  <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">
                    Hoje
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📊</span>
                    <p className="font-medium">Relatório de Biologia</p>
                  </div>
                  <div className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">
                    Em atraso
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🔢</span>
                    <p className="font-medium">Exercícios de Matemática</p>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded-full">
                    5 dias
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeachyBackground>
  )
}