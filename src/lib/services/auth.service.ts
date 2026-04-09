import type { Session } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { UserRepository } from '@/lib/repositories/user.repository'
import type { User } from '@/types/domain'

/** 인증 비즈니스 로직 서비스 */
export const AuthService = {
  /** 회원가입: Supabase Auth 계정 생성 후 users 테이블에 프로필 저장 */
  async signUp(email: string, password: string, name: string): Promise<User> {
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      throw new Error(authError?.message ?? '회원가입에 실패했습니다')
    }

    // 이메일 인증 대기 중에는 세션이 없어 auth.uid()가 null → RLS 위반 발생
    // 서비스 롤 클라이언트로 RLS를 우회하여 안전하게 프로필 저장
    const adminSupabase = createAdminClient()
    const { error: insertError } = await adminSupabase
      .from('users')
      .insert({ id: authData.user.id, email, name })

    if (insertError) {
      throw new Error(`사용자 정보 저장 실패: ${insertError.message}`)
    }

    return {
      id: authData.user.id,
      email,
      name,
      notionAccessToken: null,
      createdAt: authData.user.created_at,
    }
  },

  /** 로그인: 이메일/비밀번호 인증 */
  async signIn(email: string, password: string): Promise<{ userId: string }> {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    return { userId: data.user.id }
  },

  /** 로그아웃 */
  async signOut(): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error('로그아웃에 실패했습니다')
  },

  /** 현재 세션 조회 */
  async getSession(): Promise<Session | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) return null
    return data.session
  },

  /** 현재 인증된 사용자 조회 (도메인 타입) */
  async getCurrentUser(): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return UserRepository.findById(data.user.id)
  },
}
