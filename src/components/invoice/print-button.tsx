'use client'

import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PrintButtonProps {
  className?: string
}

/**
 * PDF 다운로드 버튼 — window.print()로 브라우저 인쇄 다이얼로그 호출
 * @media print 에서 숨김 처리되므로 PDF 출력 결과물에는 표시되지 않음
 */
export function PrintButton({ className }: PrintButtonProps) {
  return (
    <Button
      onClick={() => window.print()}
      className={cn('flex items-center gap-2 print:hidden', className)}
    >
      <Printer className="h-4 w-4" />
      PDF 다운로드
    </Button>
  )
}
