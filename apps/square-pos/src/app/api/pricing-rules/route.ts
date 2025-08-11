import { API_CONFIG } from '@/shared/constants/api'
import { apiFetch } from '@/shared/utils/apiFetch'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    const data = await apiFetch(
      `${API_CONFIG.SQUARE_BASE_URL}/v2/catalog/search`,
      {
        method: 'POST',
        body: JSON.stringify({ object_types: ['PRICING_RULE'] }),
      },
      accessToken,
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch pricing rules:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 })
  }
}
