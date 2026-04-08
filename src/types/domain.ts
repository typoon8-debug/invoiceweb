/**
 * 핵심 도메인 모델 타입 정의
 */

/** 견적서 작성자 계정 */
export interface User {
  id: string
  email: string
  name: string
  notionAccessToken: string | null
  createdAt: string
}

/** 견적서 */
export interface Invoice {
  id: string
  userId: string
  clientName: string
  clientContact: string
  validUntil: string
  totalAmount: number
  shareToken: string | null
  tokenExpiresAt: string | null
  createdAt: string
}

/** 견적서 항목 (품목) */
export interface InvoiceItem {
  id: string
  invoiceId: string
  name: string
  quantity: number
  unitPrice: number
  notionPageId: string | null
}

/** 공유 링크 상태 */
export type ShareLinkStatus = 'active' | 'expired' | 'invalid'

/** 견적서 + 항목 목록 */
export type InvoiceWithItems = Invoice & { items: InvoiceItem[] }

/** 견적서 + 공유 링크 상태 (대시보드 목록용) */
export type InvoiceWithStatus = Invoice & { linkStatus: ShareLinkStatus }
