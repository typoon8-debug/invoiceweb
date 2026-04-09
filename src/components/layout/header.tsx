import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from './container'
import { ThemeToggle } from '@/components/theme-toggle'

// 랜딩 페이지 전용 헤더 — 공개 내비게이션 없이 로고 + 인증 버튼만 표시
export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <span className="text-xl font-bold">노션 견적서</span>
          </Link>

          {/* 우측 영역: 테마 토글 + 인증 버튼 */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" size="sm">
                회원가입
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  )
}
