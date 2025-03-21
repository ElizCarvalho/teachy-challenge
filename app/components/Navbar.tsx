'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getInitial = () => {
    if (user?.name && user.name.length > 0) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U"; // U para "User" como fallback
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return "Usuário";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-primary">
                Teachy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Home
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Dashboard
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {getInitial()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email || 'Sem email'}</p>
                  </div>
                </div>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        <p>Logado como:</p>
                        <p className="font-bold">{user.email || 'Sem email'}</p>
                        <p>Função: {user.role || 'user'}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Seu Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}