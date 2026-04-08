/**
 * API / Server Action 공통 응답 타입
 * 모든 서비스 레이어의 반환 타입에 사용한다.
 */

/**
 * 단일 결과 응답 타입
 * @example
 * const result: ApiResult<User> = { success: true, data: user }
 * const error: ApiResult<User> = { success: false, error: '인증 실패', code: 'AUTH_ERROR' }
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/**
 * 페이지네이션 응답 타입
 */
export type PaginatedResult<T> = ApiResult<{
  items: T[]
  total: number
  page: number
}>
