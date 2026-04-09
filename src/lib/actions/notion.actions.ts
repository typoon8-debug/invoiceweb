'use server'

import { redirect } from 'next/navigation'

import { AuthService } from '@/lib/services/auth.service'
import { NotionOAuthService } from '@/lib/services/notion-oauth.service'
import { NotionDataService } from '@/lib/services/notion-data.service'
import { UserRepository } from '@/lib/repositories/user.repository'
import { env } from '@/lib/env'
import type { ApiResult } from '@/types/api'
import type { InvoiceItem } from '@/types/domain'
import type { NotionDatabase, NotionInvoiceHeader } from '@/lib/notion'

/**
 * 노션 연결 시작
 * - OAuth 앱 설정 시: Notion OAuth 인가 URL로 리디렉션
 * - OAuth 미설정 시(개발 환경): NOTION_API_KEY 환경변수를 직접 저장
 */
export async function connectNotionAction(): Promise<void> {
  // OAuth 앱이 설정된 경우 → 표준 OAuth 플로우
  if (env.NOTION_CLIENT_ID && env.NOTION_CLIENT_SECRET) {
    const url = NotionOAuthService.getAuthorizationUrl()
    redirect(url)
  }

  // OAuth 미설정 시 → Internal API Key 폴백 (개발 환경)
  if (env.NOTION_API_KEY) {
    const user = await AuthService.getCurrentUser()
    if (!user) redirect('/login')

    try {
      await UserRepository.updateNotionToken(user.id, env.NOTION_API_KEY)
    } catch (err) {
      const message = err instanceof Error ? err.message : '노션 토큰 저장 실패'
      throw new Error(message)
    }

    redirect('/dashboard')
  }

  throw new Error(
    'Notion 연결 설정이 없습니다. NOTION_CLIENT_ID 또는 NOTION_API_KEY를 설정하세요.'
  )
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

/**
 * Invoice DB의 페이지 목록을 견적서 헤더 정보로 조회
 */
export async function getNotionInvoiceListAction(
  databaseId: string
): Promise<ApiResult<NotionInvoiceHeader[]>> {
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
    const invoices = pages.map(page =>
      NotionDataService.extractInvoiceHeader(page)
    )
    return { success: true, data: invoices }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Invoice 목록 조회에 실패했습니다'
    return { success: false, error: message }
  }
}

/**
 * Invoice 페이지에 연결된 Items를 relation을 통해 조회
 */
export async function getNotionInvoiceItemsAction(
  invoicePageId: string
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

    const pages = await NotionDataService.getPagesByIds(
      user.notionAccessToken,
      [invoicePageId]
    )
    if (pages.length === 0) {
      return {
        success: false,
        error: '해당 Invoice 페이지를 찾을 수 없습니다',
      }
    }

    const invoicePage = pages[0]
    const items = await NotionDataService.getInvoiceRelatedItems(
      user.notionAccessToken,
      invoicePage
    )
    return { success: true, data: items }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Invoice 항목 조회에 실패했습니다'
    return { success: false, error: message }
  }
}
