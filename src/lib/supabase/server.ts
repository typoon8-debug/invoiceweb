import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { env } from '@/lib/env'

/**
 * 서버 컴포넌트 / Server Action용 Supabase 클라이언트
 * 쿠키를 통해 세션을 유지한다. Next.js 15의 cookies()는 async이므로 await 필요.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출 시 쿠키 설정 불가 — 미들웨어가 처리
          }
        },
      },
    }
  )
}
