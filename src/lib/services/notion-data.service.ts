/**
 * Notion 데이터 조회 서비스
 *
 * API 호출 로직만 담당하며, 프로퍼티 추출/타입 가드/도메인 변환은
 * @/lib/notion 유틸리티 모듈에 위임
 */

import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import type { InvoiceItem } from '@/types/domain'
import type { NotionDatabase, NotionInvoiceHeader } from '@/lib/notion'
import {
  isFullPage,
  isFullDataSource,
  mapPagesToInvoiceItems,
  mapPageToInvoiceHeader,
  extractRelatedItemIds,
} from '@/lib/notion'

// ---------------------------------------------------------------------------
// re-export: 하위 호환을 위해 타입을 여기서도 내보냄 (점진적 마이그레이션)
// ---------------------------------------------------------------------------
export type { NotionDatabase, NotionInvoiceHeader } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Notion 데이터 조회 서비스 (SDK v5 기준)
// ---------------------------------------------------------------------------

/** Notion 데이터 조회 서비스 */
export const NotionDataService = {
  /**
   * 연결된 Notion 워크스페이스의 데이터 소스(DB) 목록 조회
   * search API의 data_source 필터를 사용하여 모든 DB를 가져옴
   */
  async getDatabases(accessToken: string): Promise<NotionDatabase[]> {
    const notion = new Client({ auth: accessToken })

    const response = await notion.search({
      filter: { property: 'object', value: 'data_source' },
    })

    return response.results.filter(isFullDataSource).map(ds => ({
      id: ds.id,
      title:
        ds.title.length > 0
          ? ds.title.map(t => t.plain_text).join('')
          : '제목 없음',
    }))
  },

  /**
   * 특정 데이터 소스(DB)의 전체 페이지 목록 조회
   * 페이지네이션을 처리하여 모든 결과를 반환
   */
  async getDatabaseItems(
    accessToken: string,
    databaseId: string
  ): Promise<PageObjectResponse[]> {
    const notion = new Client({ auth: accessToken })
    const allPages: PageObjectResponse[] = []
    let cursor: string | undefined

    do {
      const response = await notion.dataSources.query({
        data_source_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      })

      const pages = response.results.filter(isFullPage)
      allPages.push(...pages)

      cursor =
        response.has_more && response.next_cursor
          ? response.next_cursor
          : undefined
    } while (cursor)

    return allPages
  },

  /**
   * Items DB 페이지 목록 → InvoiceItem[] 변환
   * @see mapPagesToInvoiceItems (@/lib/notion/mappers)
   */
  mapToInvoiceItems(pages: PageObjectResponse[]): InvoiceItem[] {
    return mapPagesToInvoiceItems(pages)
  },

  /**
   * Invoice DB 페이지에서 견적서 헤더 정보 추출
   * @see mapPageToInvoiceHeader (@/lib/notion/mappers)
   */
  extractInvoiceHeader(page: PageObjectResponse): NotionInvoiceHeader {
    return mapPageToInvoiceHeader(page)
  },

  /**
   * Invoice 페이지의 Items relation에서 관련된 Item 페이지 ID 목록 추출
   * @see extractRelatedItemIds (@/lib/notion/mappers)
   */
  getRelatedItemIds(invoicePage: PageObjectResponse): string[] {
    return extractRelatedItemIds(invoicePage)
  },

  /**
   * 여러 페이지를 ID로 병렬 조회하여 반환
   * relation으로 연결된 Items 페이지들을 가져올 때 사용
   */
  async getPagesByIds(
    accessToken: string,
    pageIds: string[]
  ): Promise<PageObjectResponse[]> {
    if (pageIds.length === 0) return []

    const notion = new Client({ auth: accessToken })

    const results = await Promise.allSettled(
      pageIds.map(pageId => notion.pages.retrieve({ page_id: pageId }))
    )

    return results
      .map((result, index) => {
        if (result.status === 'rejected') {
          console.warn(
            `[NotionDataService] 페이지 ${pageIds[index]} 조회 실패:`,
            result.reason instanceof Error
              ? result.reason.message
              : result.reason
          )
          return null
        }
        return isFullPage(result.value) ? result.value : null
      })
      .filter((page): page is PageObjectResponse => page !== null)
  },

  /**
   * Invoice 페이지에 연결된 Items를 relation을 통해 조회하고 InvoiceItem[]으로 변환
   * 1. Invoice 페이지의 Items relation에서 관련 페이지 ID 추출
   * 2. 각 페이지를 개별 조회
   * 3. InvoiceItem[]으로 변환
   */
  async getInvoiceRelatedItems(
    accessToken: string,
    invoicePage: PageObjectResponse
  ): Promise<InvoiceItem[]> {
    const itemIds = NotionDataService.getRelatedItemIds(invoicePage)
    if (itemIds.length === 0) return []

    const itemPages = await NotionDataService.getPagesByIds(
      accessToken,
      itemIds
    )
    return NotionDataService.mapToInvoiceItems(itemPages)
  },
}
