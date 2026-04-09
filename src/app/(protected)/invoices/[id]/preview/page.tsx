import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { InvoiceDocument } from '@/components/invoice/invoice-document'
import { ShareLinkButton } from '@/components/invoice/share-link-button'
import { getInvoiceByIdAction } from '@/lib/actions/invoice.actions'

interface InvoicePreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function InvoicePreviewPage({
  params,
}: InvoicePreviewPageProps) {
  const { id } = await params
  const res = await getInvoiceByIdAction(id)

  if (!res.success) {
    redirect('/dashboard')
  }

  const invoice = res.data

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
    </div>
  )
}
