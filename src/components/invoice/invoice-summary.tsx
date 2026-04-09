import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/format'

interface InvoiceSummaryProps {
  /** 합계 금액 (부가세 포함 전 소계) */
  totalAmount: number
  className?: string
}

/** 견적서 금액 요약 — 소계, 부가세(10%), 합계 표시 */
export function InvoiceSummary({
  totalAmount,
  className,
}: InvoiceSummaryProps) {
  const vat = Math.round(totalAmount * 0.1)
  const grandTotal = totalAmount + vat

  return (
    <div className={cn('flex justify-end', className)}>
      <dl className="w-64 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">소계</dt>
          <dd className="font-medium">{formatCurrency(totalAmount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">부가세 (10%)</dt>
          <dd className="font-medium">{formatCurrency(vat)}</dd>
        </div>
        <div className="flex justify-between border-t pt-2">
          <dt className="font-semibold">합계</dt>
          <dd className="text-base font-bold">{formatCurrency(grandTotal)}</dd>
        </div>
      </dl>
    </div>
  )
}
