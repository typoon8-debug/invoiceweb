'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormErrorAlert } from '@/components/common/form/form-error-alert'
import { FormFieldWrapper } from '@/components/common/form/form-field-wrapper'
import { SubmitButton } from '@/components/common/form/submit-button'
import { signInAction } from '@/lib/actions/auth.actions'
import { loginSchema, type LoginSchema } from '@/lib/schemas/auth.schema'
import { useFormAction } from '@/lib/hooks/use-form-action'

export function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { execute, isPending } = useFormAction({
    action: signInAction,
    form,
    onSuccess: () => router.push('/dashboard'),
  })

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">로그인</CardTitle>
        <CardDescription className="text-center">
          계정에 로그인하여 서비스를 이용하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(execute)} className="space-y-4">
          <FormErrorAlert message={form.formState.errors.root?.message} />
          <FormFieldWrapper
            label="이메일"
            error={form.formState.errors.email?.message}
            required
          >
            <Input
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              {...form.register('email')}
            />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="비밀번호"
            error={form.formState.errors.password?.message}
            required
          >
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              {...form.register('password')}
            />
          </FormFieldWrapper>
          <SubmitButton isPending={isPending}>로그인</SubmitButton>
        </form>
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
