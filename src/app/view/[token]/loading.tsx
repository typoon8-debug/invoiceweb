import { Skeleton } from '@/components/ui/skeleton'

/** 견적서 뷰어 페이지 로딩 스켈레톤 */
export default function ViewerLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 상단 액션 영역 */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* 견적서 문서 */}
      <Skeleton className="h-[700px] w-full rounded-xl" />
    </div>
  )
}
