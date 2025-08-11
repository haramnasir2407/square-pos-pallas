'use server'

import { API_CONFIG } from '@/shared/constants/api'
import { apiFetch } from '@/shared/utils/apiFetch'

export async function calculateOrderAction(
  orderData: { idempotency_key: string; order: orderData },
  accessToken: string,
): Promise<OrderPreview> {
  if (!accessToken) {
    throw new Error('Access token is required')
  }
  if (!orderData) {
    throw new Error('Order data is required')
  }

  const data = await apiFetch(
    `${API_CONFIG.SQUARE_BASE_URL}/v2/orders/calculate`,
    {
      method: 'POST',
      body: JSON.stringify(orderData),
    },
    accessToken,
  )

  return data as OrderPreview
}

export async function createOrderAction(
  orderData: { idempotency_key: string; order: orderData },
  accessToken: string,
) {
  if (!accessToken) {
    throw new Error('Access token is required')
  }
  if (!orderData) {
    throw new Error('Order data is required')
  }

  const data = await apiFetch(
    `${API_CONFIG.SQUARE_BASE_URL}/v2/orders`,
    {
      method: 'POST',
      body: JSON.stringify(orderData),
    },
    accessToken,
  )

  return data as OrderResult
}
