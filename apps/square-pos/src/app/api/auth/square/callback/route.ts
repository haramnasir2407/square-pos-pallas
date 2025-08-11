// this is for testing square oauth manually

import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code received' }, { status: 400 })
  }

  try {
    // token exchange
    const tokenResponse = await fetch(`${process.env.SQUARE_API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_SQUARE_ID ?? '',
        client_secret: process.env.AUTH_SQUARE_SECRET ?? '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.SQUARE_REDIRECT_URI}`,
      }),
    })

    // console.log("Token response status:3", tokenResponse.status);
    // console.log(
    //   "Token response headers:",
    //   Object.fromEntries(tokenResponse.headers.entries())
    // );

    const responseText = await tokenResponse.text()
    // console.log("Token response body:", responseText);

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          error: 'Token exchange failed',
          status: tokenResponse.status,
          response: responseText,
        },
        { status: 400 },
      )
    }

    const tokens = JSON.parse(responseText)
    // console.log("Successfully received tokens:", tokens);
    // get merchant info
    const merchantResponse = await fetch(`${process.env.SQUARE_API_BASE}/v2/merchants/me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Square-Version': '2025-06-18',
      },
    })

    // console.log("Merchant response status:", merchantResponse.status);

    if (!merchantResponse.ok) {
      const merchantErrorText = await merchantResponse.text()
      console.log('Merchant error:', merchantErrorText)
      return NextResponse.json(
        {
          error: 'Failed to get merchant info',
          status: merchantResponse.status,
          response: merchantErrorText,
        },
        { status: 400 },
      )
    }

    const merchantData = await merchantResponse.json()
    // console.log("Merchant data:", merchantData);

    return NextResponse.json({
      success: true,
      tokens,
      merchant: merchantData.merchant,
    })
  } catch (error) {
    console.error('Error in manual callback:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
