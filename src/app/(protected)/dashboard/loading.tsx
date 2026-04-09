import { Skeleton } from '@/components/ui/skeleton'

/** 대시보드 페이지 로딩 스켈레톤 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* 노션 연동 카드 */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* 견적서 목록 */}
      <section className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  )
}
