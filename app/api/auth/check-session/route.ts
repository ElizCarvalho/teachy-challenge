import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Issuer, Client } from 'openid-client'

let oidcClient: Client | null = null

async function getOidcClient() {
  if (oidcClient) return oidcClient
  
  try {
    const issuer = await Issuer.discover(`${process.env.NEXT_PUBLIC_ZITADEL_URL}/.well-known/openid-configuration`)
    
    oidcClient = new issuer.Client({
      client_id: process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID!,
      client_secret: process.env.ZITADEL_CLIENT_SECRET!,
      redirect_uris: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`],
      response_types: ['code'],
    })
    
    return oidcClient
  } catch (error) {
    console.error('Error creating OIDC client:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  const userSession = cookieStore.get('user_session')
  
  if (!accessToken || !userSession) {
    return NextResponse.json(
      { authenticated: false, message: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  try {
    const client = await getOidcClient()
    
    const tokenInfo = await client.introspect(accessToken.value)
    
    if (!tokenInfo.active) {
      return await refreshToken(request)
    }
    
    return NextResponse.json({
      authenticated: true,
      user: JSON.parse(userSession.value),
    })
    
  } catch (error) {
    console.error('Session check error:', error)
    
    return await refreshToken(request)
  }
}

async function refreshToken(_request: NextRequest) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')
  
  if (!refreshToken) {
    return NextResponse.json(
      { authenticated: false, message: 'No refresh token' },
      { status: 401 }
    )
  }
  
  try {
    const client = await getOidcClient()
    
    const tokenSet = await client.refresh(refreshToken.value)
    
    if (!tokenSet.access_token) {
      cookieStore.delete('access_token')
      cookieStore.delete('refresh_token')
      cookieStore.delete('user_session')
      
      return NextResponse.json(
        { authenticated: false, message: 'Session expired' },
        { status: 401 }
      )
    }
    
    cookieStore.set('access_token', tokenSet.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenSet.expires_in || 3600,
      path: '/',
    })
    
    if (tokenSet.refresh_token) {
      cookieStore.set('refresh_token', tokenSet.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })
    }
    
    const userSession = cookieStore.get('user_session')
    if (userSession) {
      return NextResponse.json({
        authenticated: true,
        user: JSON.parse(userSession.value),
      })
    }
    
    return NextResponse.json(
      { authenticated: false, message: 'Invalid session' },
      { status: 401 }
    )
    
  } catch (error) {
    console.error('Token refresh error:', error)
    
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('user_session')
    
    return NextResponse.json(
      { authenticated: false, message: 'Error refreshing session' },
      { status: 500 }
    )
  }
}