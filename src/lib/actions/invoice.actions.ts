'use server'

import { AuthService } from '@/lib/services/auth.service'
import { InvoiceService } from '@/lib/services/invoice.service'
import { invoiceCreateSchema } from '@/lib/schemas/invoice.schema'
import type { ApiResult } from '@/types/api'
import type { InvoiceWithItems, InvoiceWithStatus } from '@/types/domain'

/**
 * 견적서 생성 Server Action
 * invoiceCreateSchema 검증 후 InvoiceService.createInvoice 호출
 */
export async function createInvoiceAction(
  formData: unknown
): Promise<ApiResult<{ id: string }>> {
  const user = await AuthService.getCurrentUser()
  if (!user) return { success: false, error: '인증이 필요합니다' }

  const parsed = invoiceCreateSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError.message }
  }

  try {
    const invoice = await InvoiceService.createInvoice(user.id, parsed.data)
    return { success: true, data: { id: invoice.id } }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '견적서 생성에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * 공유 링크 생성 Server Action
 */
export async function generateShareLinkAction(
  invoiceId: string
): Promise<ApiResult<string>> {
  const user = await AuthService.getCurrentUser()
  if (!user) return { success: false, error: '인증이 필요합니다' }

  try {
    const shareUrl = await InvoiceService.generateShareLink(invoiceId, user.id)
    return { success: true, data: shareUrl }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '공유 링크 생성에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * 견적서 목록 조회 Server Action
 */
export async function getInvoiceListAction(): Promise<
  ApiResult<InvoiceWithStatus[]>
> {
  const user = await AuthService.getCurrentUser()
  if (!user) return { success: false, error: '인증이 필요합니다' }

  try {
    const invoices = await InvoiceService.getInvoiceList(user.id)
    return { success: true, data: invoices }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '견적서 목록 조회에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * 단일 견적서 조회 Server Action
 */
export async function getInvoiceByIdAction(
  invoiceId: string
): Promise<ApiResult<InvoiceWithItems>> {
  const user = await AuthService.getCurrentUser()
  if (!user) return { success: false, error: '인증이 필요합니다' }

  try {
    const invoice = await InvoiceService.getInvoiceById(invoiceId, user.id)
    if (!invoice) return { success: false, error: '견적서를 찾을 수 없습니다' }
    return { success: true, data: invoice }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '견적서 조회에 실패했습니다'
    return { success: false, error: message }
  }
}
