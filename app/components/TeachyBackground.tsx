'use client'

import React from 'react'

interface TeachyBackgroundProps {
  children: React.ReactNode
}

export default function TeachyBackground({ children }: TeachyBackgroundProps) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
      
      <div className="absolute top-32 right-1/4 text-white text-4xl">✨</div>
      <div className="absolute top-20 right-1/3 text-white text-2xl">✨</div>
      
      <div className="absolute right-20 bottom-0 text-9xl pointer-events-none">
        📚
      </div>
      
      <div className="absolute top-8 right-8 bg-white rounded-full px-6 py-2 shadow-md hidden md:flex space-x-4">
        <span className="text-xl">✨</span>
        <span className="text-xl">📋</span>
        <span className="text-xl">🏫</span>
        <span className="text-xl">📝</span>
        <span className="text-xl">📹</span>
        <span className="text-xl">📚</span>
        <span className="text-xl">🧩</span>
        <span className="text-xl">📘</span>
        <span className="text-xl">🖋️</span>
        <span className="text-xl">✂️</span>
      </div>
      
      <div className="absolute top-6 left-6">
        <div className="text-2xl font-bold text-gray-800">
          <span className="text-blue-600">T</span>eachy
        </div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}