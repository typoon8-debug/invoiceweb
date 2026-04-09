import { Skeleton } from '@/components/ui/skeleton'

/** 견적서 미리보기 페이지 로딩 스켈레톤 */
export default function InvoicePreviewLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* 견적서 문서 */}
      <div className="mx-auto w-full max-w-3xl">
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>

      {/* 공유 링크 섹션 */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border p-6">
          <Skeleton className="mb-3 h-6 w-24" />
          <Skeleton className="mb-4 h-4 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  )
}
