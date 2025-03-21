import { NextResponse } from 'next/server'
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

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  
  try {
    if (accessToken) {
      const client = await getOidcClient()
      
      try {
        await client.revoke(accessToken.value)
      } catch (revokeError) {
        console.error('Token revocation failed:', revokeError)
      }
    }
    
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('user_session')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('user_session')
    
    return NextResponse.json(
      { success: true, message: 'Cookies cleared but token revocation failed' }
    )
  }
}