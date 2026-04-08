/**
 * 폼 입력값 타입 정의
 * React Hook Form의 제네릭 타입 파라미터로 사용한다.
 */

/** 로그인 폼 */
export interface LoginFormValues {
  email: string
  password: string
}

/** 회원가입 폼 */
export interface SignupFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

/** 견적서 항목 폼 */
export interface InvoiceItemFormValues {
  name: string
  quantity: number
  unitPrice: number
  notionPageId?: string
}

/** 견적서 생성 폼 */
export interface InvoiceCreateFormValues {
  clientName: string
  clientContact: string
  validUntil: string
  items: InvoiceItemFormValues[]
}
