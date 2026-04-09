/**
 * Notion 유틸리티 모듈 배럴 export
 *
 * 사용 예시:
 *   import { getTitle, isFullPage, mapPagesToInvoiceItems } from '@/lib/notion'
 *   import type { NotionDatabase, NotionInvoiceHeader } from '@/lib/notion'
 */

// 타입 및 상수
export type { NotionDatabase, NotionInvoiceHeader } from './types'
export { INVOICE_PROPS, ITEM_PROPS } from './types'

// 프로퍼티 헬퍼
export type { PropMap, PropValue } from './property-helpers'
export {
  getTitle,
  getRichText,
  getNumber,
  getDate,
  getSelect,
  getRelation,
  getFormulaNumber,
  getFormulaString,
  getRollupNumber,
} from './property-helpers'

// 타입 가드
export { isFullPage, isFullDataSource } from './type-guards'

// 도메인 변환 매퍼
export {
  mapPageToInvoiceItem,
  mapPagesToInvoiceItems,
  mapPageToInvoiceHeader,
  extractRelatedItemIds,
} from './mappers'
