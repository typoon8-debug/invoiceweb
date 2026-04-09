import { env } from '@/lib/env'
import { UserRepository } from '@/lib/repositories/user.repository'

/** Notion OAuth 토큰 교환 응답 타입 */
interface NotionTokenResponse {
  access_token: string
  token_type: string
  bot_id: string
  workspace_name: string
  workspace_id: string
  owner: { type: string }
}

/** Notion OAuth 플로우 서비스 */
export const NotionOAuthService = {
  /** OAuth 인가 URL 생성 */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: env.NOTION_CLIENT_ID ?? '',
      redirect_uri: env.NOTION_REDIRECT_URI ?? '',
      response_type: 'code',
      owner: 'user',
    })
    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
  },

  /** 인가 코드 → 액세스 토큰 교환 */
  async exchangeCode(code: string): Promise<string> {
    const clientId = env.NOTION_CLIENT_ID ?? ''
    const clientSecret = env.NOTION_CLIENT_SECRET ?? ''
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    )

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.NOTION_REDIRECT_URI ?? '',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Notion 토큰 교환 실패: ${error}`)
    }

    const data = (await response.json()) as NotionTokenResponse
    return data.access_token
  },

  /** 노션 연결 해제 (토큰 삭제) */
  async revokeToken(userId: string): Promise<void> {
    await UserRepository.clearNotionToken(userId)
  },
}
