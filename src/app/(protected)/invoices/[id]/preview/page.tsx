import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { InvoiceDocument } from '@/components/invoice/invoice-document'
import { ShareLinkButton } from '@/components/invoice/share-link-button'
import { getInvoiceByIdAction } from '@/lib/actions/invoice.actions'

interface InvoicePreviewPageProps {
  params: Promise<{ id: string }>
}

/** 견적서 데이터를 비동기로 가져와 렌더링하는 서버 컴포넌트 */
async function InvoicePreviewContent({ id }: { id: string }) {
  const res = await getInvoiceByIdAction(id)

  if (!res.success) {
    redirect('/dashboard')
  }

  const invoice = res.data

  return (
    <>
      {/* 견적서 문서 렌더링 */}
      <InvoiceDocument invoice={invoice} items={invoice.items} />

      {/* 공유 링크 섹션 */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border p-6">
          <h2 className="mb-3 text-lg font-semibold">공유 링크</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            링크를 생성하여 클라이언트에게 전달하세요. 링크는 30일간 유효합니다.
          </p>
          <ShareLinkButton invoiceId={id} existingToken={invoice.shareToken} />
        </div>
      </div>
    </>
  )
}

export default async function InvoicePreviewPage({
  params,
}: InvoicePreviewPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">견적서 미리보기</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            내용을 확인한 후 공유 링크를 생성하세요
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/invoices/new">← 수정하기</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-3xl">
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
        }
      >
        <InvoicePreviewContent id={id} />
      </Suspense>
    </div>
  )
}
