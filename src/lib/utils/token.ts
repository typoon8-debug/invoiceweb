import type { ShareLinkStatus } from '@/types/domain'

/**
 * 토큰 만료 여부 및 상태 확인 유틸리티
 */

/**
 * 토큰 만료 여부를 확인합니다
 * null이면 유효하지 않은 토큰으로 간주합니다
 */
export function isTokenExpired(tokenExpiresAt: string | null): boolean {
  if (tokenExpiresAt === null) return true
  return new Date(tokenExpiresAt) < new Date()
}

/**
 * 토큰 만료일시를 기반으로 공유 링크 상태를 반환합니다
 * - null → 'invalid'
 * - 만료됨 → 'expired'
 * - 유효함 → 'active'
 */
export function getLinkStatus(tokenExpiresAt: string | null): ShareLinkStatus {
  if (tokenExpiresAt === null) return 'invalid'
  if (new Date(tokenExpiresAt) < new Date()) return 'expired'
  return 'active'
}
