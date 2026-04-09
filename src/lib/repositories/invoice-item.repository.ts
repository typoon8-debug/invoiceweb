import { createClient } from '@/lib/supabase/server'
import type { InvoiceItem } from '@/types/domain'

/** DB에서 반환되는 snake_case 행 타입 */
interface InvoiceItemRow {
  id: string
  invoice_id: string
  name: string
  quantity: number
  unit_price: number
  notion_page_id: string | null
}

/** snake_case DB 행 → camelCase 도메인 타입 변환 */
function toInvoiceItem(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    name: row.name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    notionPageId: row.notion_page_id,
  }
}

/** 견적서 항목 생성 입력 타입 */
export interface CreateItemData {
  name: string
  quantity: number
  unitPrice: number
  notionPageId?: string | null
}

/** 견적서 항목 수정 입력 타입 */
export interface UpdateItemData {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

/** 견적서 항목 데이터 접근 레이어 */
export const InvoiceItemRepository = {
  /** 견적서 ID로 항목 목록 조회 */
  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)

    if (error) throw new Error(`견적서 항목 조회 실패: ${error.message}`)
    return (data as InvoiceItemRow[]).map(toInvoiceItem)
  },

  /** 항목 일괄 생성 */
  async bulkCreate(
    invoiceId: string,
    items: CreateItemData[]
  ): Promise<InvoiceItem[]> {
    const supabase = await createClient()
    const rows = items.map(item => ({
      invoice_id: invoiceId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      notion_page_id: item.notionPageId ?? null,
    }))

    const { data, error } = await supabase
      .from('invoice_items')
      .insert(rows)
      .select()

    if (error) throw new Error(`견적서 항목 생성 실패: ${error.message}`)
    return (data as InvoiceItemRow[]).map(toInvoiceItem)
  },

  /** 항목 일괄 수정 */
  async bulkUpdate(
    invoiceId: string,
    items: UpdateItemData[]
  ): Promise<InvoiceItem[]> {
    const supabase = await createClient()
    const results = await Promise.all(
      items.map(item =>
        supabase
          .from('invoice_items')
          .update({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })
          .eq('id', item.id)
          .eq('invoice_id', invoiceId)
          .select()
          .single()
      )
    )

    const updated: InvoiceItem[] = []
    for (const { data, error } of results) {
      if (error) throw new Error(`견적서 항목 수정 실패: ${error.message}`)
      updated.push(toInvoiceItem(data as InvoiceItemRow))
    }
    return updated
  },
}
