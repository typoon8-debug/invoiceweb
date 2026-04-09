'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/format'
import type { InvoiceItem } from '@/types/domain'
import { EditableCell } from './editable-cell'

interface EditableTableProps {
  items: InvoiceItem[]
  onItemsChange: (items: InvoiceItem[]) => void
}

/**
 * 견적 항목의 수량·단가를 인라인으로 편집할 수 있는 테이블
 * 변경 시 onItemsChange 호출, 소계는 실시간 재계산
 */
export function EditableTable({ items, onItemsChange }: EditableTableProps) {
  function handleChange(
    id: string,
    field: 'quantity' | 'unitPrice',
    value: number
  ) {
    const updated = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    onItemsChange(updated)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>품목명</TableHead>
            <TableHead className="w-28 text-right">수량</TableHead>
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
                <TableCell className="text-right">
                  <EditableCell
                    value={item.quantity}
                    min={1}
                    onChange={val => handleChange(item.id, 'quantity', val)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell
                    value={item.unitPrice}
                    min={0}
                    onChange={val => handleChange(item.id, 'unitPrice', val)}
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
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
