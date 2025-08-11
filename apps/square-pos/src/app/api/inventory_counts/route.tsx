// * api endpoint for getting the inventory count

import { API_CONFIG } from '@/shared/constants/api'
import { apiFetch } from '@/shared/utils/apiFetch'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
    }

    const body = await req.json()
    const { variationIds, locationIds } = body
    if (!variationIds || !Array.isArray(variationIds) || variationIds.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid variationIds array' }, { status: 400 })
    }

    // optionally allow locationIds to be passed, otherwise omit
    const payload = {
      catalog_object_ids: variationIds,
      ...(locationIds ? { location_ids: locationIds } : {}),
    }

    const data = await apiFetch(
      `${API_CONFIG.SQUARE_BASE_URL}/v2/inventory/counts/batch-retrieve`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      accessToken,
    )
    return NextResponse.json(data)
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
