import { nanoid } from 'nanoid'

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

/** 고유 공유 토큰 생성 (nanoid 21자) */
export function generateToken(): string {
  return nanoid(21)
}

/**
 * 만료일 계산
 * @param days 만료까지의 일수 (기본 30일)
 * @returns ISO 8601 만료일시 문자열
 */
export function calculateExpiry(days: number = 30): string {
  return new Date(Date.now() + days * 86_400_000).toISOString()
}

/**
 * 토큰 유효성 검사
 * @returns 'active' | 'expired' | 'invalid'
 */
export function validateToken(
  token: string | null,
  expiresAt: string | null
): ShareLinkStatus {
  if (!token) return 'invalid'
  return getLinkStatus(expiresAt)
}
