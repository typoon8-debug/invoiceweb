import { FileText } from 'lucide-react'

/**
 * 공개 뷰어 전용 레이아웃 (견적서 뷰어 / 링크 만료 안내)
 * 최소화된 헤더와 인쇄 최적화 CSS 적용
 * 헤더는 인쇄 시 숨김 처리 (print:hidden)
 */
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* 최소 헤더 — 인쇄 시 숨김 */}
      <header className="bg-background w-full border-b print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4" />
            <span>노션 견적서</span>
          </div>
        </div>
      </header>

      {/* 콘텐츠 영역 — 인쇄 시 패딩 제거 */}
      <main className="flex-1 print:p-0">{children}</main>
    </div>
  )
}
