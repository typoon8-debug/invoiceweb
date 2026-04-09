'use server'

import { AuthService } from '@/lib/services/auth.service'
import { InvoiceService } from '@/lib/services/invoice.service'
import { invoiceCreateSchema } from '@/lib/schemas/invoice.schema'
import type { ApiResult } from '@/types/api'
import type { InvoiceWithItems, InvoiceWithStatus } from '@/types/domain'
import type { InvoiceByTokenResult } from '@/lib/services/invoice.service'

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

/**
 * 토큰으로 견적서 조회 Server Action (인증 불필요)
 * 만료된 경우에도 데이터를 반환하여 뷰어에서 상태 기반 렌더링 가능
 */
export async function getInvoiceByTokenAction(
  token: string
): Promise<ApiResult<InvoiceByTokenResult>> {
  try {
    const result = await InvoiceService.getInvoiceByToken(token)
    if (!result) return { success: false, error: '존재하지 않는 링크입니다' }
    return { success: true, data: result }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '견적서 조회에 실패했습니다'
    return { success: false, error: message }
  }
}
