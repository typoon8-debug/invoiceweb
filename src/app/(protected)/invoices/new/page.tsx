import { AuthService } from '@/lib/services/auth.service'
import { InvoiceCreateForm } from '@/components/invoice/invoice-create-form'

export default async function InvoiceNewPage() {
  const user = await AuthService.getCurrentUser()
  const isNotionConnected = !!user?.notionAccessToken

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">새 견적서 만들기</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          노션 데이터베이스에서 견적 항목을 불러오고 고객 정보를 입력하세요
        </p>
      </div>
      <InvoiceCreateForm isNotionConnected={isNotionConnected} />
    </div>
  )
}
