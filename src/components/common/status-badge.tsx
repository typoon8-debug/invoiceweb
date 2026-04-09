import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ShareLinkStatus } from '@/types/domain'

interface StatusBadgeProps {
  status: ShareLinkStatus
  className?: string
}

/** 상태별 배지 컴포넌트 — 공유 링크 활성/만료/무효 상태 표시 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variantMap: Record<
    ShareLinkStatus,
    { variant: 'default' | 'secondary' | 'destructive'; label: string }
  > = {
    active: { variant: 'default', label: '활성' },
    expired: { variant: 'secondary', label: '만료' },
    invalid: { variant: 'destructive', label: '무효' },
  }

  const { variant, label } = variantMap[status]

  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  )
}
