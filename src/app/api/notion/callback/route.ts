import { NextRequest, NextResponse } from 'next/server'

import { NotionOAuthService } from '@/lib/services/notion-oauth.service'
import { UserRepository } from '@/lib/repositories/user.repository'
import { AuthService } from '@/lib/services/auth.service'
import { env } from '@/lib/env'

/** Notion OAuth 콜백: 인가 코드 수신 → 토큰 교환 → 저장 → 대시보드 이동 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (error || !code) {
    // OAuth 승인 취소 또는 에러 → 대시보드로 복귀 (미연결 상태 유지)
    return NextResponse.redirect(`${appUrl}/dashboard`)
  }

  try {
    const accessToken = await NotionOAuthService.exchangeCode(code)

    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.redirect(`${appUrl}/login`)
    }

    await UserRepository.updateNotionToken(user.id, accessToken)

    return NextResponse.redirect(`${appUrl}/dashboard`)
  } catch {
    // 토큰 교환 실패 시 대시보드로 복귀
    return NextResponse.redirect(`${appUrl}/dashboard`)
  }
}
