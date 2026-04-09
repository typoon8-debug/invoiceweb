import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NotionConnectionCardProps {
  /** 노션 연결 여부 */
  isConnected: boolean
  /** 연결하기 버튼 클릭 콜백 */
  onConnect: () => void
  /** 연결 해제 버튼 클릭 콜백 */
  onDisconnect: () => void
  className?: string
}

/** 노션 워크스페이스 연결 상태를 표시하고 연결/해제할 수 있는 카드 컴포넌트 */
export function NotionConnectionCard({
  isConnected,
  onConnect,
  onDisconnect,
  className,
}: NotionConnectionCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">노션 연동</CardTitle>
        <CardDescription>
          견적서 항목을 불러올 노션 워크스페이스를 연결하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                {/* 연결됨 상태 — 초록 점 표시 */}
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700">
                  노션 연결됨
                </span>
              </>
            ) : (
              <>
                {/* 미연결 상태 — 회색 점 표시 */}
                <span className="bg-muted-foreground inline-block h-2 w-2 rounded-full" />
                <span className="text-muted-foreground text-sm">
                  노션 미연결
                </span>
              </>
            )}
          </div>
          {isConnected ? (
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              연결 해제
            </Button>
          ) : (
            <Button size="sm" onClick={onConnect}>
              연결하기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
