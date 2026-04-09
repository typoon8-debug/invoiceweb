import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/format'
import type { InvoiceItem } from '@/types/domain'

interface InvoiceTableProps {
  /** 견적 항목 목록 */
  items: InvoiceItem[]
  className?: string
}

/** 견적서 품목 테이블 — 품목명, 수량, 단가, 소계 표시 (읽기 전용) */
export function InvoiceTable({ items, className }: InvoiceTableProps) {
  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>품목명</TableHead>
            <TableHead className="w-24 text-right">수량</TableHead>
            <TableHead className="w-36 text-right">단가</TableHead>
            <TableHead className="w-36 text-right">소계</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground py-8 text-center"
              >
                견적 항목이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            items.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
