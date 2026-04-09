import { createClient } from '@/lib/supabase/server'
import type { Invoice, InvoiceItem, InvoiceWithItems } from '@/types/domain'
import type { CreateItemData } from './invoice-item.repository'

/** DB에서 반환되는 snake_case 행 타입 */
interface InvoiceRow {
  id: string
  user_id: string
  client_name: string
  client_contact: string
  valid_until: string
  total_amount: number
  share_token: string | null
  token_expires_at: string | null
  created_at: string
}

interface InvoiceItemRow {
  id: string
  invoice_id: string
  name: string
  quantity: number
  unit_price: number
  notion_page_id: string | null
}

/** snake_case DB 행 → camelCase 도메인 타입 변환 */
function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    userId: row.user_id,
    clientName: row.client_name,
    clientContact: row.client_contact,
    validUntil: row.valid_until,
    totalAmount: Number(row.total_amount),
    shareToken: row.share_token,
    tokenExpiresAt: row.token_expires_at,
    createdAt: row.created_at,
  }
}

function toInvoiceItem(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    name: row.name,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    notionPageId: row.notion_page_id,
  }
}

/** 견적서 생성 입력 타입 */
export interface CreateInvoiceData {
  userId: string
  clientName: string
  clientContact: string
  validUntil: string
  totalAmount: number
  items: CreateItemData[]
}

/** 견적서 데이터 접근 레이어 */
export const InvoiceRepository = {
  /** 사용자의 견적서 목록 조회 (최신순) */
  async findAllByUserId(userId: string): Promise<Invoice[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`견적서 목록 조회 실패: ${error.message}`)
    return (data as InvoiceRow[]).map(toInvoice)
  },

  /** 단일 견적서 조회 (소유권 검증 포함) */
  async findById(id: string, userId: string): Promise<InvoiceWithItems | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) return null

    const row = data as InvoiceRow & { invoice_items: InvoiceItemRow[] }
    return {
      ...toInvoice(row),
      items: row.invoice_items.map(toInvoiceItem),
    }
  },

  /** 공유 토큰으로 견적서 조회 (공개 접근 — RLS에서 토큰 유효성 검증) */
  async findByToken(token: string): Promise<InvoiceWithItems | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('share_token', token)
      .single()

    if (error || !data) return null

    const row = data as InvoiceRow & { invoice_items: InvoiceItemRow[] }
    return {
      ...toInvoice(row),
      items: row.invoice_items.map(toInvoiceItem),
    }
  },

  /**
   * 견적서 + 항목 생성
   * ⚠️ Supabase는 클라이언트 SDK 수준에서 트랜잭션 미지원.
   * invoice INSERT 후 items INSERT 순차 실행 (MVP 허용 범위).
   * items INSERT 실패 시 invoice 레코드가 고아로 남을 수 있음.
   */
  async create(data: CreateInvoiceData): Promise<InvoiceWithItems> {
    const supabase = await createClient()

    // 1. 견적서 INSERT
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: data.userId,
        client_name: data.clientName,
        client_contact: data.clientContact,
        valid_until: data.validUntil,
        total_amount: data.totalAmount,
      })
      .select()
      .single()

    if (invoiceError || !invoiceData) {
      throw new Error(`견적서 생성 실패: ${invoiceError?.message}`)
    }

    const invoice = toInvoice(invoiceData as InvoiceRow)

    // 2. 견적서 항목 일괄 INSERT
    const itemRows = data.items.map(item => ({
      invoice_id: invoice.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      notion_page_id: item.notionPageId ?? null,
    }))

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemRows)
      .select()

    if (itemsError) {
      throw new Error(`견적서 항목 생성 실패: ${itemsError.message}`)
    }

    return {
      ...invoice,
      items: (itemsData as InvoiceItemRow[]).map(toInvoiceItem),
    }
  },

  /** 공유 토큰 및 만료일 업데이트 */
  async updateShareToken(
    id: string,
    token: string,
    expiresAt: string
  ): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('invoices')
      .update({
        share_token: token,
        token_expires_at: expiresAt,
      })
      .eq('id', id)

    if (error) throw new Error(`공유 토큰 저장 실패: ${error.message}`)
  },
}
