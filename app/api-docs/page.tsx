'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

// Importação dinâmica do SwaggerUI para evitar problemas de SSR
const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { 
    ssr: false, // Desativar SSR para este componente
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
);

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carrega a especificação OpenAPI
    fetch('/api/docs')
      .then(response => response.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar especificação OpenAPI:', error);
        setError('Falha ao carregar a documentação API. Por favor, tente novamente mais tarde.');
        setLoading(false);
      });
      
    // Importar o CSS do Swagger UI dinamicamente
    const loadSwaggerCss = async () => {
      try {
        await import('swagger-ui-react/swagger-ui.css');
      } catch (err) {
        console.error('Erro ao carregar CSS do Swagger UI:', err);
      }
    };
    
    loadSwaggerCss();
  }, []);

  if (error) {
    return (
      <div className="api-docs-container">
        <div className="p-4 bg-white">
          <h1 className="text-2xl font-bold mb-4">Documentação da API Teachy</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="api-docs-container">
      <div className="p-4 bg-white">
        <h1 className="text-2xl font-bold mb-4">Documentação da API Teachy</h1>
        {!loading && spec && (
          <div className="swagger-container">
            <SwaggerUI spec={spec} />
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}