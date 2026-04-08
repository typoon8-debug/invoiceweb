import { NextResponse } from 'next/server'

export async function GET(_request: Request) {
  return NextResponse.json(
    { message: 'Notion OAuth 콜백 — 미구현' },
    { status: 501 }
  )
}
