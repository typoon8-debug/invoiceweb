import { startTransition, useState } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import type { ApiResult } from '@/types/api'

interface UseFormActionOptions<TFieldValues extends FieldValues, TData> {
  /** Server Action 함수 */
  action: (data: TFieldValues) => Promise<ApiResult<TData>>
  /** React Hook Form 인스턴스 */
  form: UseFormReturn<TFieldValues>
  /** 성공 시 실행할 콜백 */
  onSuccess?: (data: TData) => void
}

interface UseFormActionReturn<TFieldValues extends FieldValues> {
  /** 폼 제출 실행 함수 — RHF handleSubmit 콜백으로 전달 */
  execute: (data: TFieldValues) => void
  /** 비동기 처리 중 여부 */
  isPending: boolean
}

/**
 * Server Action과 React Hook Form을 연결하는 커스텀 훅
 * - 성공: onSuccess 콜백 실행
 * - 실패: form.setError('root', { message }) 자동 처리
 */
export function useFormAction<TFieldValues extends FieldValues, TData>({
  action,
  form,
  onSuccess,
}: UseFormActionOptions<
  TFieldValues,
  TData
>): UseFormActionReturn<TFieldValues> {
  const [isPending, setIsPending] = useState(false)

  function execute(data: TFieldValues) {
    startTransition(async () => {
      setIsPending(true)
      try {
        const result = await action(data)
        if (result.success) {
          onSuccess?.(result.data)
        } else {
          form.setError('root', { message: result.error })
        }
      } finally {
        setIsPending(false)
      }
    })
  }

  return { execute, isPending }
}
