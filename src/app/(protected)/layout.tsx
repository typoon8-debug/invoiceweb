import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

/**
 * 보호 라우트 레이아웃 — 서버 사이드 인증 검증 + 인증된 사용자 UI
 * 미들웨어 1차 체크 이후 이중 보안 레이어로 동작한다.
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

  return (
    <AuthenticatedLayout userEmail={user.email}>{children}</AuthenticatedLayout>
  )
}
