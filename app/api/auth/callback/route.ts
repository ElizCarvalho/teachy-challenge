import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Issuer, Client, TokenSet } from 'openid-client';

let oidcClient: Client | null = null;

async function getOidcClient() {
  if (oidcClient) return oidcClient;
  
  try {
    const zitadelUrl = process.env.NEXT_PUBLIC_ZITADEL_URL;
    const clientId = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID;
    const clientSecret = process.env.ZITADEL_CLIENT_SECRET;
    
    console.log('Usando URL do Zitadel:', zitadelUrl);
    console.log('Descobrindo configuração OIDC...');
    
    const issuer = await Issuer.discover(`${zitadelUrl}/.well-known/openid-configuration`);
    
    console.log('Metadados do emissor descobertos:', {
      issuer: issuer.issuer,
      authorizationEndpoint: issuer.authorization_endpoint,
      tokenEndpoint: issuer.token_endpoint,
      userinfoEndpoint: issuer.userinfo_endpoint
    });
    
    const redirectOptions = [
      "http://localhost:3000/auth/callback",
      "http://127.0.0.1:3000/auth/callback",
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
    ];
    
    console.log('URLs de redirecionamento disponíveis:', redirectOptions);
    
    oidcClient = new issuer.Client({
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uris: redirectOptions,
      response_types: ['code'],
    });
    
    return oidcClient;
  } catch (error) {
    console.error('Erro ao criar cliente OIDC:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  console.log('Recebida solicitação de callback:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries())
  });
  
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  console.log('Parâmetros de URL:', Object.fromEntries(url.searchParams.entries()));
  console.log('Código de autorização recebido:', code ? 'presente' : 'ausente');
  
  if (!code) {
    return NextResponse.json(
      { error: 'missing_code', message: 'Código de autorização ausente' },
      { status: 400 }
    );
  }
  
  try {
    console.log('Obtendo cliente OIDC...');
    const client = await getOidcClient();
    
    const redirectOptions = [
      "http://localhost:3000/auth/callback",
      "http://127.0.0.1:3000/auth/callback",
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
    ];
    
    let tokenSet: TokenSet | null = null;
    let lastError: any = null;
    
    for (const redirectUri of redirectOptions) {
      try {
        console.log(`Tentando trocar código por tokens com redirectUri: ${redirectUri}`);
        
        const params = {
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        };
        
        console.log('Parâmetros para troca de tokens:', params);
        
        tokenSet = await client.callback(redirectUri, params);
        console.log('Troca de tokens bem-sucedida!');
        break; 
      } catch (error) {
        console.log(`Falha com redirectUri ${redirectUri}:`, (error as Error)?.message);
        lastError = error;
      }
    }
    
    if (!tokenSet) {
      console.error('Todas as tentativas de troca de token falharam:', lastError);
      return NextResponse.json(
        { 
          error: 'token_exchange_error', 
          message: lastError?.message || 'Erro na troca de token',
          details: lastError ? JSON.stringify(lastError) : undefined
        },
        { status: 500 }
      );
    }
    
    if (!tokenSet.access_token) {
      console.error('Token de acesso ausente na resposta');
      return NextResponse.json(
        { error: 'no_access_token', message: 'Token de acesso ausente na resposta' },
        { status: 500 }
      );
    }
    
    console.log('Obtendo informações do usuário...');
    
    const userInfo = await client.userinfo(tokenSet.access_token);
    
    console.log('Informações do usuário recebidas:', {
      sub: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email
    });
    
    const user = {
      id: userInfo.sub,
      name: userInfo.name || 'Usuário',
      email: userInfo.email || 'email@exemplo.com',
      role: 'admin',
      schools: ['Escola A', 'Escola B'], 
    };
    
    console.log('Autenticação bem-sucedida para:', user.email);
    
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: 'access_token',
      value: tokenSet.access_token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 dia
      sameSite: 'lax'
    });
    
    if (tokenSet.refresh_token) {
      cookieStore.set({
        name: 'refresh_token',
        value: tokenSet.refresh_token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        sameSite: 'lax'
      });
    }
    
    cookieStore.set({
      name: 'user_session',
      value: JSON.stringify(user),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 dia
      sameSite: 'lax'
    });
    
    console.log('Cookies definidos com sucesso');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro detalhado na autenticação:', error);
    
    let errorMessage = 'Erro desconhecido na troca de token';
    let errorDetails: Record<string, any> = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
      
      if (error && typeof error === 'object' && 'error' in error) {
        const oidcError = error as Record<string, any>;
        errorDetails = {
          ...errorDetails,
          openidError: oidcError.error,
          description: oidcError.error_description || 'Sem descrição disponível'
        };
      }
    }
    
    return NextResponse.json(
      { 
        error: 'token_exchange_error', 
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}