import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  className?: string
}

/** 에러 메시지를 아이콘과 함께 표시하는 컴포넌트 */
export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'text-destructive flex items-center gap-2 text-sm',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
