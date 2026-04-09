import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

// 사용 흐름 3단계 데이터
const steps = [
  {
    number: '1',
    title: '노션 연결',
    description:
      '노션 워크스페이스를 OAuth로 연결하고 데이터베이스를 선택하세요.',
  },
  {
    number: '2',
    title: '견적서 생성',
    description:
      '불러온 항목과 고객 정보를 입력해 견적서를 자동으로 생성합니다.',
  },
  {
    number: '3',
    title: '링크 공유',
    description: '토큰 기반 공유 링크를 생성해 클라이언트에게 전달하세요.',
  },
]

// CTA 섹션 — 서비스 시작 유도 및 사용 흐름 3단계 안내
export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* 헤드라인 */}
          <h2 className="mb-4 text-3xl font-bold">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            노션 워크스페이스를 연결하고 첫 견적서를 만들어 클라이언트와
            공유해보세요. 복잡한 설정 없이 5분 안에 시작할 수 있습니다.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="px-8 text-base">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 text-base">
                로그인
              </Button>
            </Link>
          </div>

          {/* 사용 흐름 3단계 — 화살표로 연결된 수평 스텝 표시 */}
          <div className="bg-muted mt-12 rounded-lg p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-center">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-1 flex-row items-center gap-4 sm:contents"
                >
                  {/* 단계 카드 */}
                  <div className="flex flex-1 flex-col items-start gap-1 text-left sm:items-center sm:text-center">
                    {/* 단계 번호 */}
                    <span className="bg-primary text-primary-foreground mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold">
                      {step.number}
                    </span>
                    <span className="font-semibold">{step.title}</span>
                    <span className="text-muted-foreground text-sm leading-snug">
                      {step.description}
                    </span>
                  </div>

                  {/* 단계 사이 화살표 — 마지막 단계에는 표시 안 함 */}
                  {index < steps.length - 1 && (
                    <span
                      className="text-muted-foreground self-center text-xl font-light"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
