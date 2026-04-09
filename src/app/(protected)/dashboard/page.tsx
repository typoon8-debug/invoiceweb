import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { NotionConnectionCard } from '@/components/common/notion-connection-card'
import { InvoiceListItem } from '@/components/invoice/invoice-list-item'
import { AuthService } from '@/lib/services/auth.service'
import { getInvoiceListAction } from '@/lib/actions/invoice.actions'
import {
  connectNotionAction,
  disconnectNotionAction,
} from '@/lib/actions/notion.actions'

export default async function DashboardPage() {
  const [user, invoiceResult] = await Promise.all([
    AuthService.getCurrentUser(),
    getInvoiceListAction(),
  ])

  const invoices = invoiceResult.success ? invoiceResult.data : []

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
      <NotionConnectionCard
        isConnected={!!user?.notionAccessToken}
        onConnect={connectNotionAction}
        onDisconnect={disconnectNotionAction}
      />

      {/* 견적서 목록 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">내 견적서</h2>
        {invoices.length === 0 ? (
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
        ) : (
          <div className="flex flex-col gap-3">
            {invoices.map(invoice => (
              <InvoiceListItem key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
