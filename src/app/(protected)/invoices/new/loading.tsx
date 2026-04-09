import { Skeleton } from '@/components/ui/skeleton'

/** 견적서 생성 페이지 로딩 스켈레톤 */
export default function InvoiceNewLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* 견적 항목 섹션 */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      {/* 고객 정보 섹션 */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full md:w-1/2" />
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}
