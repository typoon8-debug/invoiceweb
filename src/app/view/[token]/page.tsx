import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { Skeleton } from '@/components/ui/skeleton'
import { PublicLayout } from '@/components/layout/public-layout'
import { InvoiceDocument } from '@/components/invoice/invoice-document'
import { PrintButton } from '@/components/invoice/print-button'
import { InvoiceService } from '@/lib/services/invoice.service'

interface ViewerPageProps {
  params: Promise<{ token: string }>
}

/** 토큰으로 견적서를 비동기로 가져와 렌더링하는 서버 컴포넌트 */
async function ViewerContent({ token }: { token: string }) {
  const result = await InvoiceService.getInvoiceByToken(token)

  // 존재하지 않거나 유효하지 않은 토큰 → 만료 안내 페이지
  if (!result || result.status !== 'active') {
    redirect('/expired')
  }

  const { invoice } = result

  return (
    <>
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
    </>
  )
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { token } = await params

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 print:p-0">
        <Suspense
          fallback={<Skeleton className="h-[700px] w-full rounded-xl" />}
        >
          <ViewerContent token={token} />
        </Suspense>
      </div>
    </PublicLayout>
  )
}
