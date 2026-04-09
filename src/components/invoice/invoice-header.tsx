import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils/format'

interface InvoiceHeaderProps {
  /** 클라이언트 회사명 */
  clientName: string
  /** 클라이언트 담당자명 */
  clientContact: string
  /** 견적 유효기간 (ISO 날짜 문자열) */
  validUntil: string
  /** 견적서 생성일 (ISO 날짜 문자열) */
  createdAt: string
  className?: string
}

/** 견적서 상단 헤더 — 회사명, 담당자, 생성일, 유효기간 표시 */
export function InvoiceHeader({
  clientName,
  clientContact,
  validUntil,
  createdAt,
  className,
}: InvoiceHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">{clientName}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            담당자: {clientContact}
          </p>
        </div>
        <div className="text-muted-foreground text-right text-sm">
          <p>
            <span className="font-medium">견적일:</span> {formatDate(createdAt)}
          </p>
          <p>
            <span className="font-medium">유효기간:</span>{' '}
            {formatDate(validUntil)}
          </p>
        </div>
      </div>
    </div>
  )
}
