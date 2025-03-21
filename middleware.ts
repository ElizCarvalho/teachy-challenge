import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/login', '/auth/callback']

const adminPaths = ['/admin']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  if (publicPaths.some(p => path === p || path.startsWith(p + '/'))) {
    return NextResponse.next()
  }
  
  const session = request.cookies.get('user_session')
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (adminPaths.some(p => path === p || path.startsWith(p + '/'))) {
    try {
      const userSession = JSON.parse(session.value)
      
      if (userSession.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}