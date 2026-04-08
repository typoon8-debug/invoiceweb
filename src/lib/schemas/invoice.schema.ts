import { z } from 'zod'

/** 견적서 항목 스키마 */
export const invoiceItemSchema = z.object({
  name: z.string().min(1, '품목명을 입력하세요'),
  quantity: z.number().positive('수량은 0보다 커야 합니다'),
  unitPrice: z.number().nonnegative('단가는 0 이상이어야 합니다'),
  notionPageId: z.string().optional(),
})

/** 견적서 생성 폼 스키마 */
export const invoiceCreateSchema = z.object({
  clientName: z.string().min(1, '고객사명을 입력하세요'),
  clientContact: z.string().min(1, '담당자명을 입력하세요'),
  validUntil: z.string().min(1, '유효기간을 입력하세요'),
  items: z.array(invoiceItemSchema).min(1, '최소 1개 이상의 항목이 필요합니다'),
})

export type InvoiceItemSchema = z.infer<typeof invoiceItemSchema>
export type InvoiceCreateSchema = z.infer<typeof invoiceCreateSchema>
