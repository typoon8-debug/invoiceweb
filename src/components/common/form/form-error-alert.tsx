import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface FormErrorAlertProps {
  message?: string | null
  className?: string
}

/**
 * 서버 에러 메시지를 표시하는 Alert 컴포넌트
 * message가 없으면 렌더링하지 않음
 */
export function FormErrorAlert({ message, className }: FormErrorAlertProps) {
  if (!message) return null

  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
