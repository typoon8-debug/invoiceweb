'use server'

import { redirect } from 'next/navigation'

import { AuthService } from '@/lib/services/auth.service'
import { NotionOAuthService } from '@/lib/services/notion-oauth.service'
import { NotionDataService } from '@/lib/services/notion-data.service'
import type { ApiResult } from '@/types/api'
import type { InvoiceItem } from '@/types/domain'
import type { NotionDatabase } from '@/lib/services/notion-data.service'

/**
 * 노션 연결 시작: OAuth 인가 URL로 리디렉션
 */
export async function connectNotionAction(): Promise<void> {
  const url = NotionOAuthService.getAuthorizationUrl()
  redirect(url)
}

/**
 * 노션 연결 해제
 */
export async function disconnectNotionAction(): Promise<ApiResult<null>> {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) return { success: false, error: '인증이 필요합니다' }

    await NotionOAuthService.revokeToken(user.id)
    return { success: true, data: null }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '노션 연결 해제에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * 연결된 노션 DB 목록 조회
 */
export async function getNotionDatabasesAction(): Promise<
  ApiResult<NotionDatabase[]>
> {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) return { success: false, error: '인증이 필요합니다' }
    if (!user.notionAccessToken) {
      return {
        success: false,
        error: '노션이 연결되지 않았습니다',
        code: 'NOTION_NOT_CONNECTED',
      }
    }

    const databases = await NotionDataService.getDatabases(
      user.notionAccessToken
    )
    return { success: true, data: databases }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'DB 목록 조회에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * 특정 노션 DB의 항목을 견적서 항목 형태로 조회
 */
export async function getNotionDatabaseItemsAction(
  databaseId: string
): Promise<ApiResult<InvoiceItem[]>> {
  try {
    const user = await AuthService.getCurrentUser()
    if (!user) return { success: false, error: '인증이 필요합니다' }
    if (!user.notionAccessToken) {
      return {
        success: false,
        error: '노션이 연결되지 않았습니다',
        code: 'NOTION_NOT_CONNECTED',
      }
    }

    const pages = await NotionDataService.getDatabaseItems(
      user.notionAccessToken,
      databaseId
    )
    const items = NotionDataService.mapToInvoiceItems(pages)
    return { success: true, data: items }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'DB 항목 조회에 실패했습니다'
    return { success: false, error: message }
  }
}
