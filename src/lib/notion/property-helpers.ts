/**
 * Notion 페이지 프로퍼티에서 타입별 값을 추출하는 헬퍼 함수 모음
 *
 * 각 함수는 프로퍼티가 해당 타입이 아니거나 값이 없는 경우 null(또는 빈 배열)을 반환
 */

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

// ---------------------------------------------------------------------------
// 내부 타입 (간결하게 사용)
// ---------------------------------------------------------------------------

/** 페이지 프로퍼티 맵 타입 */
export type PropMap = PageObjectResponse['properties']

/** 개별 프로퍼티 값 타입 */
export type PropValue = PropMap[string]

// ---------------------------------------------------------------------------
// 프로퍼티 값 추출 헬퍼 함수
// ---------------------------------------------------------------------------

/**
 * title 타입 프로퍼티에서 문자열 추출
 * @returns 텍스트 또는 null
 */
export function getTitle(prop: PropValue | undefined): string | null {
  if (!prop || prop.type !== 'title') return null
  return prop.title.map(t => t.plain_text).join('') || null
}

/**
 * rich_text 타입 프로퍼티에서 문자열 추출
 * @returns 텍스트 또는 null
 */
export function getRichText(prop: PropValue | undefined): string | null {
  if (!prop || prop.type !== 'rich_text') return null
  return prop.rich_text.map(t => t.plain_text).join('') || null
}

/**
 * number 타입 프로퍼티에서 숫자 추출
 * @returns 숫자 또는 null
 */
export function getNumber(prop: PropValue | undefined): number | null {
  if (!prop || prop.type !== 'number') return null
  return prop.number
}

/**
 * date 타입 프로퍼티에서 시작일 문자열 추출
 * @returns ISO 날짜 문자열 또는 null
 */
export function getDate(prop: PropValue | undefined): string | null {
  if (!prop || prop.type !== 'date' || !prop.date) return null
  return prop.date.start
}

/**
 * select 타입 프로퍼티에서 선택 값 이름 추출
 * @returns 선택 값 이름 또는 null
 */
export function getSelect(prop: PropValue | undefined): string | null {
  if (!prop || prop.type !== 'select' || !prop.select) return null
  return prop.select.name
}

/**
 * relation 타입 프로퍼티에서 관련 페이지 ID 배열 추출
 * @returns 페이지 ID 배열
 */
export function getRelation(prop: PropValue | undefined): string[] {
  if (!prop || prop.type !== 'relation') return []
  return prop.relation.map(r => r.id)
}

/**
 * formula 타입 프로퍼티에서 숫자 값 추출
 * formula 결과가 number 타입인 경우에만 값을 반환
 * @returns 숫자 또는 null
 */
export function getFormulaNumber(prop: PropValue | undefined): number | null {
  if (!prop || prop.type !== 'formula') return null
  const formula = prop.formula
  if (formula.type === 'number') return formula.number
  return null
}

/**
 * formula 타입 프로퍼티에서 문자열 값 추출
 * formula 결과가 string 타입인 경우에만 값을 반환
 * @returns 문자열 또는 null
 */
export function getFormulaString(prop: PropValue | undefined): string | null {
  if (!prop || prop.type !== 'formula') return null
  const formula = prop.formula
  if (formula.type === 'string') return formula.string
  return null
}

/**
 * rollup 타입 프로퍼티에서 숫자 값 추출
 * rollup 결과가 number 타입인 경우에만 값을 반환
 * @returns 숫자 또는 null
 */
export function getRollupNumber(prop: PropValue | undefined): number | null {
  if (!prop || prop.type !== 'rollup') return null
  const rollup = prop.rollup
  if (rollup.type === 'number') return rollup.number
  return null
}
