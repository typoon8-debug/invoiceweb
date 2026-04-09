'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormErrorAlert } from '@/components/common/form/form-error-alert'
import { FormFieldWrapper } from '@/components/common/form/form-field-wrapper'
import { SubmitButton } from '@/components/common/form/submit-button'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EditableTable } from '@/components/invoice/editable-table'
import { formatCurrency } from '@/lib/utils/format'
import {
  invoiceCreateSchema,
  type InvoiceCreateSchema,
} from '@/lib/schemas/invoice.schema'
import { createInvoiceAction } from '@/lib/actions/invoice.actions'
import {
  getNotionDatabasesAction,
  getNotionDatabaseItemsAction,
  getNotionInvoiceListAction,
  getNotionInvoiceItemsAction,
} from '@/lib/actions/notion.actions'
import type { InvoiceItem } from '@/types/domain'
import type { NotionDatabase, NotionInvoiceHeader } from '@/lib/notion'

interface InvoiceCreateFormProps {
  /** 노션 연결 여부 — 서버에서 전달 */
  isNotionConnected: boolean
}

/** 견적서 생성 폼 클라이언트 컴포넌트 */
export function InvoiceCreateForm({
  isNotionConnected,
}: InvoiceCreateFormProps) {
  const router = useRouter()
  const [showNotionDialog, setShowNotionDialog] = useState(!isNotionConnected)
  const [databases, setDatabases] = useState<NotionDatabase[]>([])
  const [selectedDbId, setSelectedDbId] = useState('')
  const [invoiceHeaders, setInvoiceHeaders] = useState<NotionInvoiceHeader[]>(
    []
  )
  const [selectedInvoicePageId, setSelectedInvoicePageId] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [isLoadingDbs, setIsLoadingDbs] = useState(false)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<InvoiceCreateSchema>({
    resolver: zodResolver(invoiceCreateSchema),
    defaultValues: {
      clientName: '',
      clientContact: '',
      validUntil: '',
      items: [],
    },
  })

  /** 연결된 노션 DB 목록 로드 */
  useEffect(() => {
    if (!isNotionConnected) return
    setIsLoadingDbs(true)
    getNotionDatabasesAction().then(res => {
      if (res.success) setDatabases(res.data)
      setIsLoadingDbs(false)
    })
  }, [isNotionConnected])

  /**
   * DB 선택 시 Invoice 목록 로드 시도
   * Invoice DB이면 → 견적서 목록 드롭다운 표시
   * Items DB 등 다른 DB이면 → 기존 방식으로 항목 직접 로드
   */
  async function handleDbSelect(dbId: string) {
    setSelectedDbId(dbId)
    setSelectedInvoicePageId('')
    setItems([])
    setInvoiceHeaders([])

    // Invoice DB 여부 판별: 견적서 헤더 목록 로드 시도
    setIsLoadingInvoices(true)
    const invoiceRes = await getNotionInvoiceListAction(dbId)
    setIsLoadingInvoices(false)

    if (invoiceRes.success && invoiceRes.data.length > 0) {
      // Invoice DB → 견적서 목록 표시 (Step 2 드롭다운 활성화)
      setInvoiceHeaders(invoiceRes.data)
    } else {
      // Invoice가 아닌 DB (Items DB 등) → 기존 방식으로 항목 직접 로드
      setIsLoadingItems(true)
      const itemsRes = await getNotionDatabaseItemsAction(dbId)
      setIsLoadingItems(false)
      if (itemsRes.success) {
        const loaded = itemsRes.data.map((item, idx) => ({
          ...item,
          id: item.id || `notion-${idx}`,
        }))
        syncItems(loaded)
      }
    }
  }

  /**
   * 견적서 선택 시 관련 Items 로드 + 고객 정보 자동 입력
   * Invoice 페이지의 relation을 통해 연결된 Items를 가져옴
   */
  async function handleInvoiceSelect(pageId: string) {
    setSelectedInvoicePageId(pageId)
    const header = invoiceHeaders.find(h => h.notionPageId === pageId)

    // Invoice 헤더에서 고객 정보 자동 입력
    if (header) {
      if (header.clientName) form.setValue('clientName', header.clientName)
      if (header.dueDate) form.setValue('validUntil', header.dueDate)
    }

    // relation을 통해 연결된 Items 로드
    setIsLoadingItems(true)
    const res = await getNotionInvoiceItemsAction(pageId)
    setIsLoadingItems(false)
    if (res.success) {
      const loaded = res.data.map((item, idx) => ({
        ...item,
        id: item.id || `notion-${idx}`,
      }))
      syncItems(loaded)
    }
  }

  /** 항목 변경 시 로컬 상태 + RHF items 필드 동기화 */
  function syncItems(updated: InvoiceItem[]) {
    setItems(updated)
    form.setValue(
      'items',
      updated.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notionPageId: item.notionPageId ?? undefined,
      })),
      { shouldValidate: false }
    )
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  async function onSubmit(data: InvoiceCreateSchema) {
    setIsPending(true)
    setServerError(null)
    try {
      const res = await createInvoiceAction(data)
      if (res.success) {
        router.push(`/invoices/${res.data.id}/preview`)
      } else {
        setServerError(res.error)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      {/* 노션 미연결 안내 다이얼로그 */}
      <ConfirmDialog
        open={showNotionDialog}
        onOpenChange={open => {
          setShowNotionDialog(open)
          if (!open) router.push('/dashboard')
        }}
        title="노션 연결이 필요합니다"
        description="견적서 항목을 불러오려면 노션 워크스페이스를 먼저 연결해야 합니다."
        confirmLabel="대시보드로 돌아가기"
        cancelLabel="닫기"
        onConfirm={() => router.push('/dashboard')}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <FormErrorAlert
          message={serverError ?? form.formState.errors.root?.message}
        />

        {/* 견적 항목 섹션 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">견적 항목</h2>

          {/* 노션 DB 드롭다운 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              노션 데이터베이스 선택
            </label>
            <Select
              value={selectedDbId}
              onValueChange={handleDbSelect}
              disabled={isLoadingDbs || !isNotionConnected}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoadingDbs ? '로딩 중...' : 'DB를 선택하세요'}
                />
              </SelectTrigger>
              <SelectContent>
                {databases.map(db => (
                  <SelectItem key={db.id} value={db.id}>
                    {db.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 견적서 선택 드롭다운 (Invoice DB 선택 시에만 표시) */}
          {invoiceHeaders.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">견적서 선택</label>
              <Select
                value={selectedInvoicePageId}
                onValueChange={handleInvoiceSelect}
                disabled={isLoadingInvoices}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingInvoices ? '로딩 중...' : '견적서를 선택하세요'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {invoiceHeaders.map(inv => (
                    <SelectItem key={inv.notionPageId} value={inv.notionPageId}>
                      {inv.invoiceNumber} - {inv.clientName}
                      {inv.paymentStatus ? ` (${inv.paymentStatus})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 편집 가능 항목 테이블 */}
          {isLoadingItems ? (
            <p className="text-muted-foreground text-sm">
              항목을 불러오는 중...
            </p>
          ) : (
            <EditableTable items={items} onItemsChange={syncItems} />
          )}

          {/* items 배열 유효성 에러 */}
          {form.formState.errors.items && (
            <p className="text-destructive text-sm">
              최소 1개 이상의 견적 항목이 필요합니다
            </p>
          )}

          {/* 합계 금액 */}
          <div className="flex justify-end border-t pt-3">
            <span className="text-lg font-semibold">
              합계: {formatCurrency(total)}
            </span>
          </div>
        </section>

        {/* 고객 정보 섹션 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">고객 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="고객사명"
              error={form.formState.errors.clientName?.message}
              required
            >
              <Input
                placeholder="(주)예시 회사"
                {...form.register('clientName')}
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              label="담당자명"
              error={form.formState.errors.clientContact?.message}
              required
            >
              <Input placeholder="홍길동" {...form.register('clientContact')} />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper
            label="견적 유효기간"
            error={form.formState.errors.validUntil?.message}
            required
          >
            <Input type="date" {...form.register('validUntil')} />
          </FormFieldWrapper>
        </section>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">← 취소</Link>
          </Button>
          <SubmitButton isPending={isPending}>미리보기</SubmitButton>
        </div>
      </form>
    </>
  )
}
