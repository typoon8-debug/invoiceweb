'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 다이얼로그 제목 */
  title: string
  /** 다이얼로그 설명 (옵션) */
  description?: string
  /** 확인 버튼 레이블 (기본: '확인') */
  confirmLabel?: string
  /** 취소 버튼 레이블 (기본: '취소') */
  cancelLabel?: string
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm: () => void
  /** 확인 버튼 로딩 상태 */
  isLoading?: boolean
  /** 다이얼로그 내부 추가 콘텐츠 슬롯 */
  children?: React.ReactNode
}

/** 확인/취소 모달 다이얼로그 컴포넌트 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? '처리 중...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
