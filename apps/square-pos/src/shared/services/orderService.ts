// * SERVER COMPONENT (dynamic rendering)

export async function calculateOrderService(
  orderData: { idempotency_key: string; order: orderData },
  accessToken: string,
) {
  const response = await fetch('/api/orders/calculate-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderData, accessToken }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to calculate order')
  }

  return response.json()
}

export async function createOrderService(
  orderData: { idempotency_key: string; order: orderData },
  accessToken: string,
) {
  const response = await fetch('/api/orders/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderData, accessToken }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to create order')
  }

  return response.json()
}
