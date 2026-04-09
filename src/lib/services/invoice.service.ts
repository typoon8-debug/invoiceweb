import { InvoiceRepository } from '@/lib/repositories/invoice.repository'
import {
  generateToken,
  calculateExpiry,
  getLinkStatus,
  validateToken,
} from '@/lib/utils/token'
import { env } from '@/lib/env'
import type {
  InvoiceWithItems,
  InvoiceWithStatus,
  ShareLinkStatus,
} from '@/types/domain'
import type { InvoiceCreateSchema } from '@/lib/schemas/invoice.schema'

/** 토큰으로 조회 시 반환 타입: 견적서 데이터 + 유효성 상태 */
export interface InvoiceByTokenResult {
  invoice: InvoiceWithItems
  status: ShareLinkStatus
}

/** 견적서 비즈니스 로직 서비스 */
export const InvoiceService = {
  /**
   * 견적서 생성
   * 총 금액은 items에서 자동 계산
   */
  async createInvoice(
    userId: string,
    data: InvoiceCreateSchema
  ): Promise<InvoiceWithItems> {
    // 유효기간 과거 날짜 검증
    if (new Date(data.validUntil) < new Date()) {
      throw new Error('유효기간은 오늘 이후 날짜여야 합니다')
    }

    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )

    return InvoiceRepository.create({
      userId,
      clientName: data.clientName,
      clientContact: data.clientContact,
      validUntil: data.validUntil,
      totalAmount,
      items: data.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notionPageId: item.notionPageId ?? null,
      })),
    })
  },

  /**
   * 공유 링크 생성
   * 토큰 생성 후 DB 저장, 공유 URL 반환
   */
  async generateShareLink(invoiceId: string, userId: string): Promise<string> {
    // 소유권 검증
    const invoice = await InvoiceRepository.findById(invoiceId, userId)
    if (!invoice) throw new Error('견적서를 찾을 수 없습니다')

    const token = generateToken()
    const expiresAt = calculateExpiry(30)

    await InvoiceRepository.updateShareToken(invoiceId, token, expiresAt)

    const appUrl = env.NEXT_PUBLIC_APP_URL ?? ''
    return appUrl ? `${appUrl}/view/${token}` : `/view/${token}`
  },

  /**
   * 사용자의 견적서 목록 조회 (공유 링크 상태 포함)
   */
  async getInvoiceList(userId: string): Promise<InvoiceWithStatus[]> {
    const invoices = await InvoiceRepository.findAllByUserId(userId)
    return invoices.map(invoice => ({
      ...invoice,
      linkStatus: getLinkStatus(invoice.tokenExpiresAt),
    }))
  },

  /**
   * 단일 견적서 조회 (소유권 검증)
   */
  async getInvoiceById(
    invoiceId: string,
    userId: string
  ): Promise<InvoiceWithItems | null> {
    return InvoiceRepository.findById(invoiceId, userId)
  },

  /**
   * 토큰으로 견적서 조회 (공개 접근)
   * 만료된 경우에도 데이터를 반환하여 뷰어 페이지에서 안내 렌더링 가능
   */
  async getInvoiceByToken(token: string): Promise<InvoiceByTokenResult | null> {
    const invoice = await InvoiceRepository.findByToken(token)
    if (!invoice) return null

    const status = validateToken(invoice.shareToken, invoice.tokenExpiresAt)
    return { invoice, status }
  },
}
