/**
 * 인증 페이지 전용 레이아웃 (로그인 / 회원가입)
 * 화면 중앙 정렬 카드 형태로 표시
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
