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
import { signUpAction } from '@/lib/actions/auth.actions'
import { signupSchema, type SignupSchema } from '@/lib/schemas/auth.schema'
import { useFormAction } from '@/lib/hooks/use-form-action'

export function SignupForm() {
  const router = useRouter()

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { execute, isPending } = useFormAction({
    action: signUpAction,
    form,
    onSuccess: () => router.push('/dashboard'),
  })

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          회원가입
        </CardTitle>
        <CardDescription className="text-center">
          새 계정을 만들어 서비스를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(execute)} className="space-y-4">
          <FormErrorAlert message={form.formState.errors.root?.message} />
          <FormFieldWrapper
            label="이름"
            error={form.formState.errors.name?.message}
            required
          >
            <Input
              type="text"
              placeholder="홍길동"
              autoComplete="name"
              {...form.register('name')}
            />
          </FormFieldWrapper>
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
              placeholder="8자 이상 입력하세요"
              autoComplete="new-password"
              {...form.register('password')}
            />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="비밀번호 확인"
            error={form.formState.errors.confirmPassword?.message}
            required
          >
            <Input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              {...form.register('confirmPassword')}
            />
          </FormFieldWrapper>
          <SubmitButton isPending={isPending}>회원가입</SubmitButton>
        </form>
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
