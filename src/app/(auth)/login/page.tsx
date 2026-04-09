import { Metadata } from 'next'

import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: '로그인',
  description: '계정에 로그인하여 서비스를 이용하세요',
}

export default function LoginPage() {
  return <LoginForm />
}
