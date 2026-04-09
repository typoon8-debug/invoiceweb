import { AuthLayout } from '@/components/layout/auth-layout'

/**
 * 인증 라우트 그룹 레이아웃 — 로그인 / 회원가입 페이지 공용
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
