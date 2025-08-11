import { API_CONFIG } from '@/shared/constants/api'

/**
 * Shared fetch utility for API requests with consistent headers and error handling
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @param accessToken - Optional access token for Authorization header
 * @returns Parsed JSON response
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Square-Version': `${API_CONFIG.SQUARE_VERSION}`,
  }

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  }

  const response = await fetch(url, fetchOptions)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
