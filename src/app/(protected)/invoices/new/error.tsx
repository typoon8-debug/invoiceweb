'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

/** 견적서 생성 페이지 에러 경계 */
export default function InvoiceNewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <AlertCircle className="text-destructive h-12 w-12" />
      <h2 className="text-xl font-semibold">견적서를 생성할 수 없습니다</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {error.message || '페이지를 불러오는 중 문제가 발생했습니다.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          다시 시도
        </Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">대시보드로 이동</Link>
        </Button>
      </div>
    </div>
  )
}
