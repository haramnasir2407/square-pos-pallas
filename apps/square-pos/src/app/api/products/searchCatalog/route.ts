// this is the API route that fetches products from the Square API
// server side rendering

import { API_CONFIG } from '@/shared/constants/api'
import { apiFetch } from '@/shared/utils/apiFetch'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { object_types, query, include_related_objects } = await req.json()
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '')

  const url = `${API_CONFIG.SQUARE_BASE_URL}/v2/catalog/search`
  const body = {
    object_types,
    query,
    include_related_objects,
  }

  try {
    const data = await apiFetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      accessToken,
    )
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Failed to fetch products',
      },
      { status: 500 },
    )
  }
}
