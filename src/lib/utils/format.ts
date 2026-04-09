/**
 * 숫자/날짜 포맷 유틸리티
 */

/**
 * 금액을 한국 원화 형식으로 포맷합니다
 * @example formatCurrency(1000000) → '1,000,000원'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

/**
 * ISO 날짜 문자열을 한국어 날짜 형식으로 포맷합니다
 * @example formatDate('2026-04-09') → '2026년 4월 9일'
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
