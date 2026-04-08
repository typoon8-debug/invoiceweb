import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  return NextResponse.json(
    { message: 'PDF 생성 — 미구현', token },
    { status: 501 }
  )
}
