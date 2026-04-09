'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/actions/auth.actions'

/** 로그아웃 클라이언트 컴포넌트 — signOutAction 호출 후 /login으로 리디렉션 */
export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOutAction()
    router.push('/login')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">로그아웃</span>
    </Button>
  )
}
