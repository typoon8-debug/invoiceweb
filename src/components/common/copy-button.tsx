'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  /** 클립보드에 복사할 텍스트 */
  text: string
  className?: string
}

/** 클립보드 복사 버튼 컴포넌트 — 복사 성공 시 2초간 체크 아이콘 표시 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      // 2초 후 원래 상태로 복원
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn('gap-2', className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          복사
        </>
      )}
    </Button>
  )
}
