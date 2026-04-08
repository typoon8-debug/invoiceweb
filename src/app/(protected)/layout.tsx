import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

/**
 * 보호 라우트 레이아웃 — 서버 사이드 인증 검증
 * 미들웨어 1차 체크 이후 이중 보안 레이어로 동작한다.
 * Phase 2에서 인증된 사용자용 레이아웃(헤더/네비게이션)으로 완성 예정.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
