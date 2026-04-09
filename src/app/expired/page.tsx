import { LinkIcon } from 'lucide-react'

import { PublicLayout } from '@/components/layout/public-layout'

export default function ExpiredPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="bg-muted rounded-full p-4">
          <LinkIcon className="text-muted-foreground h-10 w-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">링크가 만료되었습니다</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            이 견적서 링크는 만료되었거나 유효하지 않습니다.
          </p>
        </div>
        <div className="bg-muted rounded-lg px-6 py-4">
          <p className="text-sm">
            견적서를 다시 확인하려면{' '}
            <strong>견적서 작성자에게 새 링크를 요청</strong>하세요.
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
