import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// 히어로 섹션 — 서비스 핵심 가치 제안 및 주요 CTA 표시
export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* 서비스 뱃지 */}
          <Badge variant="secondary" className="mb-6">
            노션 연동 견적서 서비스
          </Badge>

          {/* 메인 헤드라인 */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            노션으로 견적서를 만들고
            <span className="text-primary mt-2 block">
              클라이언트와 바로 공유하세요
            </span>
          </h1>

          {/* 서비스 설명 */}
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            노션 데이터베이스에서 항목을 불러와 견적서를 생성하고, 토큰 기반
            링크로 클라이언트와 안전하게 공유하세요. 별도 로그인 없이 웹에서
            확인하고 PDF로 저장할 수 있습니다.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">무료로 시작하기</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                로그인
              </Button>
            </Link>
          </div>

          {/* 핵심 기능 요약 통계 */}
          <div className="mt-16 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="text-xl font-bold">노션 연동</div>
              <div className="text-muted-foreground text-sm">
                DB 항목 자동 불러오기
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">자동 견적서 생성</div>
              <div className="text-muted-foreground text-sm">
                고객 정보 + 노션 항목 조합
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">링크 공유</div>
              <div className="text-muted-foreground text-sm">
                토큰 기반 만료 URL
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">PDF 다운로드</div>
              <div className="text-muted-foreground text-sm">
                로그인 없이 저장 가능
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
