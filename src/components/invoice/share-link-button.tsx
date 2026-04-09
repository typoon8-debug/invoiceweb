'use client'

import { useState } from 'react'
import { Link2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/common/copy-button'
import { generateShareLinkAction } from '@/lib/actions/invoice.actions'

interface ShareLinkButtonProps {
  invoiceId: string
  /** 이미 생성된 공유 토큰 (있으면 초기값으로 표시) */
  existingToken: string | null
}

/** 공유 링크 생성 + 복사 클라이언트 컴포넌트 */
export function ShareLinkButton({
  invoiceId,
  existingToken,
}: ShareLinkButtonProps) {
  /** 기존 토큰이 있으면 URL을 초기값으로 설정 */
  const [shareUrl, setShareUrl] = useState<string | null>(() => {
    if (!existingToken) return null
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    return `${appUrl}/view/${existingToken}`
  })
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setIsPending(true)
    setError(null)
    try {
      const res = await generateShareLinkAction(invoiceId)
      if (res.success) {
        setShareUrl(res.data)
      } else {
        setError(res.error)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 공유 링크 생성 버튼 */}
      <Button
        onClick={handleGenerate}
        disabled={isPending}
        className="flex items-center gap-2"
      >
        <Link2 className="h-4 w-4" />
        {isPending ? '생성 중...' : shareUrl ? '링크 재생성' : '공유 링크 생성'}
      </Button>

      {/* 에러 메시지 */}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* 생성된 링크 표시 + 복사 버튼 */}
      {shareUrl && (
        <div className="bg-muted flex items-center gap-2 rounded-md border p-3">
          <span className="text-muted-foreground flex-1 truncate text-sm">
            {shareUrl}
          </span>
          <CopyButton text={shareUrl} />
        </div>
      )}
    </div>
  )
}
