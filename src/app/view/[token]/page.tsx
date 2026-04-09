import { redirect } from 'next/navigation'

import { PublicLayout } from '@/components/layout/public-layout'
import { InvoiceDocument } from '@/components/invoice/invoice-document'
import { PrintButton } from '@/components/invoice/print-button'
import { InvoiceService } from '@/lib/services/invoice.service'

interface ViewerPageProps {
  params: Promise<{ token: string }>
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { token } = await params
  const result = await InvoiceService.getInvoiceByToken(token)

  // 존재하지 않거나 유효하지 않은 토큰 → 만료 안내 페이지
  if (!result || result.status !== 'active') {
    redirect('/expired')
  }

  const { invoice } = result

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 print:p-0">
        {/* 인쇄 시 숨겨지는 상단 액션 영역 */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div>
            <p className="text-muted-foreground text-sm">
              아래 견적서를 확인하세요
            </p>
          </div>
          <PrintButton />
        </div>

        {/* 견적서 문서 */}
        <InvoiceDocument invoice={invoice} items={invoice.items} />
      </div>
    </PublicLayout>
  )
}
