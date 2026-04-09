'use client'

import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

/** 대시보드 에러 경계 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <AlertCircle className="text-destructive h-12 w-12" />
      <h2 className="text-xl font-semibold">대시보드를 불러올 수 없습니다</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {error.message || '데이터를 불러오는 중 문제가 발생했습니다.'}
      </p>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  )
}
