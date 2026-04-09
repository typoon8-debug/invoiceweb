import { cn } from '@/lib/utils'
import type { Invoice, InvoiceItem } from '@/types/domain'
import { InvoiceHeader } from './invoice-header'
import { InvoiceTable } from './invoice-table'
import { InvoiceSummary } from './invoice-summary'

interface InvoiceDocumentProps {
  /** 견적서 기본 정보 */
  invoice: Invoice
  /** 견적 항목 목록 */
  items: InvoiceItem[]
  className?: string
}

/**
 * 완성된 견적서 문서 컴포넌트 (Server Component)
 * InvoiceHeader + InvoiceTable + InvoiceSummary를 조합하여 렌더링합니다.
 * 뷰어 페이지와 미리보기 페이지에서 공용으로 사용됩니다.
 */
export function InvoiceDocument({
  invoice,
  items,
  className,
}: InvoiceDocumentProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl rounded-xl bg-white p-8 shadow-md print:shadow-none',
        className
      )}
    >
      {/* 견적서 제목 */}
      <h1 className="text-foreground mb-6 text-center text-3xl font-bold tracking-tight">
        견적서
      </h1>

      {/* 고객 정보 헤더 */}
      <InvoiceHeader
        clientName={invoice.clientName}
        clientContact={invoice.clientContact}
        validUntil={invoice.validUntil}
        createdAt={invoice.createdAt}
        className="mb-8"
      />

      {/* 품목 테이블 */}
      <InvoiceTable items={items} className="mb-6" />

      {/* 금액 요약 */}
      <InvoiceSummary totalAmount={invoice.totalAmount} />
    </div>
  )
}
