import { z } from 'zod'

/** 로그인 폼 스키마 */
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

/** 회원가입 폼 스키마 */
export const signupSchema = z
  .object({
    name: z.string().min(1, '이름을 입력하세요'),
    email: z.string().email('올바른 이메일 주소를 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력하세요'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
