'use client'

import { useAuth } from '../components/AuthProvider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TeachyBackground from '../components/TeachyBackground'
import Notification, { useNotification } from '../components/Notification'

interface Session {
  id: string;
  device: string;
  lastActive: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schools: string[];
  sessions: Session[];
}

export default function Admin() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/admin/sessions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        showNotification({
          type: 'error',
          message: 'Falha ao carregar usuários. Por favor, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, showNotification]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  const handleTerminateSession = async (userId: string, sessionId: string) => {
    try {
      const response = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to terminate session');
      }
      
      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            sessions: u.sessions.filter(s => s.id !== sessionId)
          }
        }
        return u
      }));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          sessions: selectedUser.sessions.filter(s => s.id !== sessionId)
        });
      }
      
      showNotification({
        type: 'success',
        message: 'Sessão encerrada com sucesso!',
      });
      
    } catch (err) {
      console.error('Error terminating session:', err);
      showNotification({
        type: 'error',
        message: 'Falha ao encerrar sessão. Tente novamente.',
      });
    }
  };
  
  const handleTerminateAllSessions = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, terminateAll: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to terminate all sessions');
      }
      
      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            sessions: []
          }
        }
        return u
      }));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          sessions: []
        });
      }
      
      showNotification({
        type: 'success',
        message: 'Todas as sessões encerradas com sucesso!',
      });
      
    } catch (err) {
      console.error('Error terminating all sessions:', err);
      showNotification({
        type: 'error',
        message: 'Falha ao encerrar todas as sessões. Tente novamente.',
      });
    }
  };

  if (isLoading || loading) {
    return (
      <TeachyBackground>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeachyBackground>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <TeachyBackground>
      <div className="flex min-h-screen pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-tr-2xl rounded-br-2xl shadow-lg hidden md:block p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">🏠</span>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-50 text-purple-600">
                    <span className="text-xl">⚙️</span>
                    <span>Administração</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">👥</span>
                    <span>Usuários</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">🏫</span>
                    <span>Escolas</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span className="text-xl">📊</span>
                    <span>Relatórios</span>
                  </a>
                </li>
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
          {notification && (
            <Notification 
              type={notification.type}
              message={notification.message}
              duration={notification.duration}
              onClose={hideNotification}
            />
          )}
          
          <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de Usuários */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Usuários</h2>
              
              {users.length === 0 ? (
                <p className="text-gray-500 italic">Nenhum usuário encontrado.</p>
              ) : (
                <div className="space-y-3">
                  {users.map(u => (
                    <div 
                      key={u.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === u.id ? 'bg-purple-50 border border-purple-200' : 'border border-gray-100'}`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                          u.role === 'admin' ? 'bg-purple-500' : 
                          u.role === 'teacher' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs rounded-full px-2 py-1 ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          u.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {u.role}
                        </span>
                        <span className="text-xs text-gray-500">{u.sessions.length} sessões ativas</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Detalhes do Usuário */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {selectedUser ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Detalhes do Usuário: {selectedUser.name}</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Informações</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2"><span className="font-medium">ID:</span> {selectedUser.id}</p>
                      <p className="mb-2"><span className="font-medium">Email:</span> {selectedUser.email}</p>
                      <p className="mb-2"><span className="font-medium">Função:</span> {selectedUser.role}</p>
                      <p><span className="font-medium">Escolas:</span> {selectedUser.schools.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium">Sessões Ativas</h3>
                      {selectedUser.sessions.length > 0 && (
                        <button 
                          onClick={() => handleTerminateAllSessions(selectedUser.id)}
                          className="px-3 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                        >
                          Encerrar todas
                        </button>
                      )}
                    </div>
                    
                    {selectedUser.sessions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedUser.sessions.map((session) => (
                          <div key={session.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-xs text-gray-500">
                                Último acesso: {new Date(session.lastActive).toLocaleString()}
                              </p>
                            </div>
                            <button 
                              onClick={() => handleTerminateSession(selectedUser.id, session.id)}
                              className="px-3 py-1 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded-full transition-colors"
                            >
                              Encerrar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 italic text-center">
                        Nenhuma sessão ativa.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-500 h-64">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <p>Selecione um usuário para ver os detalhes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TeachyBackground>
  )
}