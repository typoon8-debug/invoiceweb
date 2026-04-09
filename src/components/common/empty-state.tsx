import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** 상단에 표시할 아이콘 (옵션) */
  icon?: React.ReactNode
  /** 제목 텍스트 */
  title: string
  /** 부연 설명 텍스트 (옵션) */
  description?: string
  /** CTA 버튼 등 액션 슬롯 (옵션) */
  children?: React.ReactNode
  className?: string
}

/** 목록이 비어있을 때 표시하는 빈 상태 안내 컴포넌트 */
export function EmptyState({
  icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className
      )}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-foreground text-lg font-semibold">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      )}
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
