import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/** 로딩 스피너 크기 variant 정의 */
const loadingSpinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface LoadingSpinnerProps
  extends VariantProps<typeof loadingSpinnerVariants> {
  className?: string
}

/** 로딩 상태를 표시하는 스피너 컴포넌트 */
export function LoadingSpinner({ size, className }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn(loadingSpinnerVariants({ size }), className)} />
    </div>
  )
}
