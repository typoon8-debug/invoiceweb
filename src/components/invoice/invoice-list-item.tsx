import Link from 'next/link'
import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/common/copy-button'
import { StatusBadge } from '@/components/common/status-badge'
import { formatCurrency } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/format'
import { env } from '@/lib/env'
import type { InvoiceWithStatus } from '@/types/domain'

interface InvoiceListItemProps {
  invoice: InvoiceWithStatus
}

/** 대시보드 견적서 목록 아이템 — 상태 뱃지, 공유 링크 복사, 미리보기 링크 포함 */
export function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  const shareUrl =
    invoice.shareToken && invoice.linkStatus === 'active'
      ? `${env.NEXT_PUBLIC_APP_URL ?? ''}/view/${invoice.shareToken}`
      : null

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{invoice.clientName}</span>
          <StatusBadge status={invoice.linkStatus} />
        </div>
        <div className="text-muted-foreground flex gap-3 text-sm">
          <span>총액: {formatCurrency(invoice.totalAmount)}</span>
          <span>유효기간: {formatDate(invoice.validUntil)}</span>
          <span>생성일: {formatDate(invoice.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {shareUrl && <CopyButton text={shareUrl} />}
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/invoices/${invoice.id}/preview`}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            미리보기
          </Link>
        </Button>
      </div>
    </div>
  )
}
