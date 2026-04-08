import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/middleware'

/**
 * Next.js 미들웨어 — 인증 기반 라우트 보호
 * - 보호 라우트(/dashboard, /invoices/*): 비인증 시 /login 리디렉션
 * - 인증 페이지(/login, /signup): 인증된 사용자는 /dashboard 리디렉션
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createClient(request, response)

  // 세션 갱신 및 사용자 정보 조회 (getSession 대신 getUser 사용 — 보안상 권장)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/invoices')

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/signup')

  // 보호 라우트: 비인증 → /login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 인증 페이지: 이미 로그인 → /dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
