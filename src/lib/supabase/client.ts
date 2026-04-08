import { createBrowserClient } from '@supabase/ssr'

import { env } from '@/lib/env'

/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 싱글톤 클라이언트
 * 'use client' 컴포넌트 또는 커스텀 훅에서만 사용한다.
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
