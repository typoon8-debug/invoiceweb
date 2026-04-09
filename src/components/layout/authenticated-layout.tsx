import Link from 'next/link'
import { FileText, LayoutDashboard, LogOut, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  userEmail?: string
}

/**
 * 인증된 사용자 전용 레이아웃
 * 헤더(로고 + 네비게이션 + 로그아웃 버튼) + 콘텐츠 영역 제공
 * 로그아웃 기능은 Phase 3 (Task 008) signOutAction 연결 예정
 */
export function AuthenticatedLayout({
  children,
  userEmail,
}: AuthenticatedLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* 로고 */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-bold"
            >
              <FileText className="text-primary h-5 w-5" />
              <span>노션 견적서</span>
            </Link>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  대시보드
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/invoices/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />새 견적서
                </Link>
              </Button>
            </nav>
          </div>

          {/* 우측 영역 */}
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-muted-foreground hidden text-sm sm:block">
                {userEmail}
              </span>
            )}
            {/* 로그아웃 버튼: Phase 3에서 signOutAction 연결 예정 */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
