import Link from 'next/link'
import TeachyBackground from './components/TeachyBackground'

export default function Home() {
  return (
    <TeachyBackground>
      <div className="flex min-h-screen">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Aprendizado mais fácil com Teachy
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma educacional completa para gestão de escolas, professores e alunos.
            </p>
            
            <div className="space-y-4">
              <Link href="/login" 
                className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors">
                Acessar Plataforma
              </Link>
              
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Recursos principais:</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 text-xl">✓</span>
                    <span>Sistema de autenticação seguro com 2FA</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 text-xl">✓</span>
                    <span>Integração com redes sociais (Google, Facebook)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 text-xl">✓</span>
                    <span>Gerenciamento de permissões por escola</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500 text-xl">✓</span>
                    <span>Painel administrativo para monitoramento</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeachyBackground>
  )
}