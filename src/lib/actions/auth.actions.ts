'use server'

import { AuthService } from '@/lib/services/auth.service'
import { loginSchema, signupSchema } from '@/lib/schemas/auth.schema'
import type { ApiResult } from '@/types/api'
import type { User } from '@/types/domain'

/** Supabase 에러 메시지 → 한국어 변환 */
function toKoreanError(message: string): string {
  if (message.includes('Invalid login credentials'))
    return '이메일 또는 비밀번호가 올바르지 않습니다'
  if (message.includes('User already registered'))
    return '이미 가입된 이메일 주소입니다'
  if (message.includes('Email not confirmed')) return '이메일 인증이 필요합니다'
  if (message.includes('Password should be'))
    return '비밀번호는 8자 이상이어야 합니다'
  return message
}

/**
 * 회원가입 Server Action
 * signupSchema 검증 후 AuthService.signUp 호출
 */
export async function signUpAction(
  formData: Record<string, string>
): Promise<ApiResult<Pick<User, 'id' | 'email' | 'name'>>> {
  const parsed = signupSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError.message }
  }

  try {
    const user = await AuthService.signUp(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    )
    return {
      success: true,
      data: { id: user.id, email: user.email, name: user.name },
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '회원가입에 실패했습니다'
    return { success: false, error: toKoreanError(message) }
  }
}

/**
 * 로그인 Server Action
 * loginSchema 검증 후 AuthService.signIn 호출
 */
export async function signInAction(
  formData: Record<string, string>
): Promise<ApiResult<{ userId: string }>> {
  const parsed = loginSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError.message }
  }

  try {
    const result = await AuthService.signIn(
      parsed.data.email,
      parsed.data.password
    )
    return { success: true, data: result }
  } catch (err) {
    const message = err instanceof Error ? err.message : '로그인에 실패했습니다'
    return { success: false, error: toKoreanError(message) }
  }
}

/**
 * 로그아웃 Server Action
 */
export async function signOutAction(): Promise<ApiResult<null>> {
  try {
    await AuthService.signOut()
    return { success: true, data: null }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '로그아웃에 실패했습니다'
    return { success: false, error: message }
  }
}
