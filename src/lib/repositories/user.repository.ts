import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types/domain'

/** DB에서 반환되는 snake_case 행 타입 */
interface UserRow {
  id: string
  email: string
  name: string
  notion_access_token: string | null
  created_at: string
}

/** snake_case DB 행 → camelCase 도메인 타입 변환 */
function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    notionAccessToken: row.notion_access_token,
    createdAt: row.created_at,
  }
}

/** 사용자 데이터 접근 레이어 */
export const UserRepository = {
  /** ID로 사용자 조회 */
  async findById(id: string): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return toUser(data as UserRow)
  },

  /** 노션 액세스 토큰 저장 */
  async updateNotionToken(userId: string, token: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .update({ notion_access_token: token })
      .eq('id', userId)

    if (error) throw new Error(`노션 토큰 저장 실패: ${error.message}`)
  },

  /** 노션 액세스 토큰 삭제 (연결 해제) */
  async clearNotionToken(userId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .update({ notion_access_token: null })
      .eq('id', userId)

    if (error) throw new Error(`노션 토큰 삭제 실패: ${error.message}`)
  },
}
