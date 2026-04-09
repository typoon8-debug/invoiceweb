import { createClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'

/**
 * Supabase 서비스 롤 클라이언트 (서버 전용)
 * RLS를 우회하는 관리자 권한 클라이언트 — 신뢰된 서버 로직에서만 사용
 * 절대 클라이언트 사이드에 노출하지 말 것
 */
export function createAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase 관리자 환경 변수가 설정되지 않았습니다')
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
