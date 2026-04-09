/**
 * Notion API 응답 객체에 대한 타입 가드 함수
 *
 * Notion SDK의 응답은 partial 객체를 포함할 수 있으므로
 * 완전한 객체인지 확인하는 가드가 필요
 */

import type {
  PageObjectResponse,
  DataSourceObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

/**
 * 응답 결과가 완전한 페이지 객체인지 확인
 * partial_page 응답을 걸러낼 때 사용
 */
export function isFullPage(item: {
  object: string
}): item is PageObjectResponse {
  return item.object === 'page' && 'properties' in item
}

/**
 * 응답 결과가 완전한 데이터 소스(DB) 객체인지 확인
 * search API 응답에서 실제 DB 객체만 필터링할 때 사용
 */
export function isFullDataSource(item: {
  object: string
}): item is DataSourceObjectResponse {
  return item.object === 'data_source' && 'title' in item
}
