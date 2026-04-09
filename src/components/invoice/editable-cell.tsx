'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

interface EditableCellProps {
  value: number
  onChange: (value: number) => void
  min?: number
  className?: string
}

/**
 * 견적서 항목의 수량·단가를 인라인으로 편집하는 셀
 * onBlur 시 onChange 콜백 호출
 */
export function EditableCell({
  value,
  onChange,
  min = 0,
  className,
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState(String(value))

  function handleBlur() {
    const parsed = Number(localValue)
    const next = isNaN(parsed) ? min : Math.max(min, parsed)
    setLocalValue(String(next))
    onChange(next)
  }

  return (
    <input
      type="number"
      min={min}
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className={cn(
        'border-input bg-background w-full rounded-md border px-2 py-1 text-right text-sm',
        'focus:ring-ring focus:ring-2 focus:ring-offset-1 focus:outline-none',
        className
      )}
    />
  )
}
