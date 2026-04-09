import { Suspense } from 'react'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { NotionConnectionCard } from '@/components/common/notion-connection-card'
import { InvoiceListItem } from '@/components/invoice/invoice-list-item'
import { AuthService } from '@/lib/services/auth.service'
import { getInvoiceListAction } from '@/lib/actions/invoice.actions'
import {
  connectNotionAction,
  disconnectNotionAction,
} from '@/lib/actions/notion.actions'

/** 노션 연동 상태를 비동기로 가져오는 서버 컴포넌트 */
async function NotionSection() {
  const user = await AuthService.getCurrentUser()

  return (
    <NotionConnectionCard
      isConnected={!!user?.notionAccessToken}
      onConnect={connectNotionAction}
      onDisconnect={disconnectNotionAction}
    />
  )
}

/** 견적서 목록을 비동기로 가져오는 서버 컴포넌트 */
async function InvoiceListSection() {
  const invoiceResult = await getInvoiceListAction()
  const invoices = invoiceResult.success ? invoiceResult.data : []

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-10 w-10" />}
        title="견적서가 없습니다"
        description="새 견적서를 만들어 클라이언트와 공유해 보세요"
      >
        <Button asChild>
          <Link href="/invoices/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 견적서 만들기
          </Link>
        </Button>
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {invoices.map(invoice => (
        <InvoiceListItem key={invoice.id} invoice={invoice} />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            견적서를 관리하고 클라이언트와 공유하세요
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 견적서
          </Link>
        </Button>
      </div>

      {/* 노션 연동 카드 */}
      <Suspense fallback={<Skeleton className="h-24 w-full rounded-xl" />}>
        <NotionSection />
      </Suspense>

      {/* 견적서 목록 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">내 견적서</h2>
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          }
        >
          <InvoiceListSection />
        </Suspense>
      </section>
    </div>
  )
}
