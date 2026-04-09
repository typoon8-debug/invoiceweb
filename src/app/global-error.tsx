'use client'

import { AlertCircle } from 'lucide-react'

/** 전역 에러 경계 (루트 레이아웃 에러 포함) */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">
            예기치 않은 오류가 발생했습니다
          </h2>
          <p className="max-w-md text-center text-sm text-gray-500">
            {error.message || '서비스에 일시적인 문제가 발생했습니다.'}
          </p>
          <button
            onClick={reset}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}
