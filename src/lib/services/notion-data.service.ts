import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  DataSourceObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

import type { InvoiceItem } from '@/types/domain'

/** Notion DB 정보 */
export interface NotionDatabase {
  id: string
  title: string
}

/** 프로퍼티 타입 가드: title 타입 */
function isTitleProp(
  prop: Record<string, unknown>
): prop is { type: 'title'; title: Array<{ plain_text: string }> } {
  return prop.type === 'title' && Array.isArray(prop.title)
}

/** 프로퍼티 타입 가드: number 타입 */
function isNumberProp(
  prop: Record<string, unknown>
): prop is { type: 'number'; number: number | null } {
  return prop.type === 'number'
}

/** Notion 데이터 조회 서비스 (SDK v5 기준) */
export const NotionDataService = {
  /** 연결된 Notion 워크스페이스의 데이터 소스(DB) 목록 조회 */
  async getDatabases(accessToken: string): Promise<NotionDatabase[]> {
    const notion = new Client({ auth: accessToken })

    const response = await notion.search({
      filter: { property: 'object', value: 'data_source' },
    })

    return response.results
      .filter(
        (item): item is DataSourceObjectResponse =>
          item.object === 'data_source'
      )
      .map(db => ({
        id: db.id,
        title:
          db.title.length > 0
            ? db.title.map(t => t.plain_text).join('')
            : '제목 없음',
      }))
  },

  /** 특정 데이터 소스(DB)의 페이지 목록 조회 */
  async getDatabaseItems(
    accessToken: string,
    databaseId: string
  ): Promise<PageObjectResponse[]> {
    const notion = new Client({ auth: accessToken })

    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    })

    return response.results.filter(
      (page): page is PageObjectResponse =>
        page.object === 'page' && 'properties' in page
    )
  },

  /** Notion 페이지 목록 → InvoiceItem[] 변환 */
  mapToInvoiceItems(pages: PageObjectResponse[]): InvoiceItem[] {
    return pages.map((page, index) => {
      const props = page.properties as Record<string, Record<string, unknown>>

      // 품목명: title 타입 프로퍼티 첫 번째
      let name = `항목 ${index + 1}`
      for (const prop of Object.values(props)) {
        if (isTitleProp(prop) && prop.title.length > 0) {
          name = prop.title.map(t => t.plain_text).join('')
          break
        }
      }

      // 수량, 단가: 프로퍼티명 휴리스틱 매핑
      let quantity = 1
      let unitPrice = 0

      for (const [key, prop] of Object.entries(props)) {
        if (!isNumberProp(prop) || prop.number === null) continue

        const keyLower = key.toLowerCase()
        if (
          keyLower.includes('수량') ||
          keyLower.includes('quantity') ||
          keyLower.includes('qty')
        ) {
          quantity = prop.number ?? 1
        } else if (
          keyLower.includes('단가') ||
          keyLower.includes('price') ||
          keyLower.includes('금액') ||
          keyLower.includes('unit')
        ) {
          unitPrice = prop.number ?? 0
        }
      }

      // 필수 필드 누락 경고
      if (name === `항목 ${index + 1}`) {
        console.warn(`[NotionDataService] 페이지 ${page.id}: title 필드 없음`)
      }
      if (unitPrice === 0) {
        console.warn(`[NotionDataService] 페이지 ${page.id}: 단가 필드 없음`)
      }

      return {
        id: '',
        invoiceId: '',
        name,
        quantity,
        unitPrice,
        notionPageId: page.id,
      }
    })
  },
}
