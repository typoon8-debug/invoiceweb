/**
 * Notion 페이지를 앱 도메인 모델로 변환하는 매퍼 함수 모음
 *
 * property-helpers와 프로퍼티 키 상수를 활용하여
 * Notion 페이지 → InvoiceItem, NotionInvoiceHeader 등으로 변환
 */

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import type { InvoiceItem } from '@/types/domain'
import type { NotionInvoiceHeader } from './types'
import { INVOICE_PROPS, ITEM_PROPS } from './types'
import {
  getTitle,
  getRichText,
  getNumber,
  getDate,
  getSelect,
  getRelation,
  getFormulaNumber,
  getRollupNumber,
} from './property-helpers'

// ---------------------------------------------------------------------------
// Items DB → InvoiceItem 변환
// ---------------------------------------------------------------------------

/**
 * 단일 Items DB 페이지를 InvoiceItem으로 변환
 * @param page - Notion 페이지 응답 객체
 * @param index - 페이지 순서 (이름 누락 시 기본값 생성용)
 * @returns InvoiceItem 도메인 객체
 */
export function mapPageToInvoiceItem(
  page: PageObjectResponse,
  index: number
): InvoiceItem {
  const props = page.properties

  // 품목명: title 타입 프로퍼티
  const rawName = getTitle(props[ITEM_PROPS.itemName])
  const name = rawName ?? `항목 ${index + 1}`

  // 수량: number 타입 프로퍼티
  const quantity = getNumber(props[ITEM_PROPS.quantity]) ?? 1

  // 단가: number 타입 프로퍼티
  const unitPrice = getNumber(props[ITEM_PROPS.unitPrice]) ?? 0

  // 필수 필드 누락 경고
  if (!rawName) {
    console.warn(
      `[NotionMapper] 페이지 ${page.id}: ${ITEM_PROPS.itemName} 필드 없음`
    )
  }
  if (unitPrice === 0) {
    console.warn(
      `[NotionMapper] 페이지 ${page.id}: ${ITEM_PROPS.unitPrice} 값이 0이거나 필드 없음`
    )
  }

  return {
    id: '',
    invoiceId: '',
    name,
    quantity,
    unitPrice,
    notionPageId: page.id,
  }
}

/**
 * Items DB 페이지 배열을 InvoiceItem 배열로 변환
 * @param pages - Notion 페이지 응답 객체 배열
 * @returns InvoiceItem 도메인 객체 배열
 */
export function mapPagesToInvoiceItems(
  pages: PageObjectResponse[]
): InvoiceItem[] {
  return pages.map((page, index) => mapPageToInvoiceItem(page, index))
}

// ---------------------------------------------------------------------------
// Invoice DB → NotionInvoiceHeader 변환
// ---------------------------------------------------------------------------

/**
 * Invoice DB 페이지에서 견적서 헤더 정보 추출
 * totalAmount는 formula, rollup, number 타입 모두 대응
 * @param page - Notion 페이지 응답 객체
 * @returns 견적서 헤더 정보
 */
export function mapPageToInvoiceHeader(
  page: PageObjectResponse
): NotionInvoiceHeader {
  const props = page.properties

  return {
    notionPageId: page.id,
    invoiceNumber: getTitle(props[INVOICE_PROPS.invoiceNumber]) ?? '',
    clientName: getRichText(props[INVOICE_PROPS.clientName]) ?? '',
    invoiceDate: getDate(props[INVOICE_PROPS.invoiceDate]),
    dueDate: getDate(props[INVOICE_PROPS.dueDate]),
    paymentStatus: getSelect(props[INVOICE_PROPS.paymentStatus]),
    // totalAmount는 formula 또는 rollup 타입일 수 있음
    totalAmount:
      getFormulaNumber(props[INVOICE_PROPS.totalAmount]) ??
      getRollupNumber(props[INVOICE_PROPS.totalAmount]) ??
      getNumber(props[INVOICE_PROPS.totalAmount]) ??
      null,
  }
}

// ---------------------------------------------------------------------------
// Invoice → Items relation ID 추출
// ---------------------------------------------------------------------------

/**
 * Invoice 페이지의 Items relation에서 관련된 Item 페이지 ID 목록 추출
 * @param invoicePage - Invoice DB의 Notion 페이지 응답 객체
 * @returns 관련 Item 페이지 ID 배열
 */
export function extractRelatedItemIds(
  invoicePage: PageObjectResponse
): string[] {
  return getRelation(invoicePage.properties[INVOICE_PROPS.items])
}
