'use client'

import { LoadingSpinner } from '@/components/common/loading-spinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof Button>

interface SubmitButtonProps extends Omit<ButtonProps, 'type' | 'disabled'> {
  isPending?: boolean
}

/**
 * isPending 상태를 내장한 폼 제출 버튼
 * isPending=true 시 로딩 스피너 표시 + disabled 처리
 */
export function SubmitButton({
  isPending = false,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className={cn('w-full', className)}
      {...props}
    >
      {isPending ? (
        <>
          <LoadingSpinner size="sm" />
          처리중...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
