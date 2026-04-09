'use client'

import { cn } from '@/lib/utils'

interface FormFieldWrapperProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * 폼 필드 공통 래퍼 — label + input 슬롯 + 에러 메시지를 묶는 컴포넌트
 */
export function FormFieldWrapper({
  label,
  error,
  required,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm leading-none font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
