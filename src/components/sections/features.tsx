import { Container } from '@/components/layout/container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Database,
  FileText,
  Link2,
  Eye,
  Download,
  LayoutDashboard,
} from 'lucide-react'

// 서비스 핵심 기능 목록 — PRD 기능 명세(F001~F006) 기반
const features = [
  {
    icon: Database,
    title: '노션 데이터 연동',
    description:
      '연결된 노션 데이터베이스에서 품목·수량·단가를 자동으로 불러옵니다. 두 번 입력할 필요 없이 노션이 입력 도구가 됩니다.',
  },
  {
    icon: FileText,
    title: '견적서 자동 생성',
    description:
      '노션 항목과 고객 정보를 조합해 전문적인 견적서 문서를 자동으로 생성합니다. 수량·단가 인라인 수정도 지원합니다.',
  },
  {
    icon: Link2,
    title: '공유 링크 생성',
    description:
      '만료 기한이 있는 고유 토큰 URL을 생성합니다. 클라이언트는 별도 로그인 없이 링크만으로 견적서를 확인할 수 있습니다.',
  },
  {
    icon: Eye,
    title: '견적서 웹 뷰어',
    description:
      '클라이언트가 토큰 URL로 접속하면 깔끔한 웹 페이지로 견적서를 확인할 수 있습니다. 모바일에서도 최적화된 화면을 제공합니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description:
      '뷰어 페이지에서 버튼 하나로 견적서를 PDF 파일로 저장합니다. 인쇄에 최적화된 레이아웃으로 전문적인 문서를 제공합니다.',
  },
  {
    icon: LayoutDashboard,
    title: '견적서 목록 관리',
    description:
      '발행한 견적서 목록을 한눈에 관리합니다. 공유 링크의 활성/만료 상태를 뱃지로 확인하고, 링크를 즉시 복사할 수 있습니다.',
  },
]

// 기능 소개 섹션 — 서비스의 핵심 기능 6가지를 카드 그리드로 표시
export function FeaturesSection() {
  return (
    <section className="bg-muted/50 py-20">
      <Container>
        {/* 섹션 헤더 */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">핵심 기능</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            노션에서 시작해 클라이언트 전달까지, 견적서 워크플로우 전체를
            지원합니다.
          </p>
        </div>

        {/* 기능 카드 그리드 — 모바일 1열 / 태블릿 2열 / 데스크톱 3열 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <Card
              key={feature.title}
              className="bg-background border-0 shadow-none"
            >
              <CardHeader>
                <feature.icon className="text-primary mb-2 h-10 w-10" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
