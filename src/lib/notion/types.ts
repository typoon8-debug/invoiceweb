/**
 * Notion 관련 공용 타입 및 프로퍼티 키 상수 정의
 */

// ---------------------------------------------------------------------------
// 공개 인터페이스
// ---------------------------------------------------------------------------

/** Notion DB(데이터 소스) 요약 정보 */
export interface NotionDatabase {
  id: string
  title: string
}

/** Invoice DB 페이지에서 추출한 견적서 헤더 정보 */
export interface NotionInvoiceHeader {
  notionPageId: string
  invoiceNumber: string
  clientName: string
  invoiceDate: string | null
  dueDate: string | null
  paymentStatus: string | null
  totalAmount: number | null
}

// ---------------------------------------------------------------------------
// Notion DB 프로퍼티 키 상수 (오타 방지)
// ---------------------------------------------------------------------------

/** Invoice DB 프로퍼티 키 상수 */
export const INVOICE_PROPS = {
  invoiceNumber: 'invoiceNumber',
  clientName: 'clientName',
  invoiceDate: 'invoiceDate',
  dueDate: 'dueDate',
  paymentStatus: 'paymentStatus',
  totalAmount: 'totalAmount',
  items: 'Items',
} as const

/** Items DB 프로퍼티 키 상수 */
export const ITEM_PROPS = {
  itemName: 'itemName',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalAmount: 'totalAmount',
  invoice: 'Invoice',
} as const
