import NextAuth, {
  type NextAuthConfig,
  type Session,
  type User,
  type Account,
  type Profile,
  type NextAuthResult,
} from 'next-auth'

// import log from 'logging-service'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'

// Extend Session type to include custom properties
interface CustomSession extends Session {
  accessToken?: string
  merchantId?: string
}

const authConfig: NextAuthConfig = {
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        merchantId: { label: 'Merchant ID', type: 'text' },
        merchantName: { label: 'Merchant Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) {
          return null
        }

        return {
          id: credentials.merchantId as string,
          name: credentials.merchantName as string,
          email: null,
          image: null,
          accessToken: credentials.accessToken as string,
          refreshToken: credentials.refreshToken as string,
          merchantId: credentials.merchantId as string,
        }
      },
    },
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT
      account?: Account | null
      profile?: Profile
      user?: User | AdapterUser
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        // merchant_id is not standard, so check type
        if (account && typeof account === 'object' && 'merchant_id' in account) {
          token.merchantId = (account as { merchant_id?: string }).merchant_id
        }
      }

      // Handle credentials provider
      if (user && typeof user === 'object' && 'accessToken' in user) {
        token.accessToken = (user as { accessToken?: string }).accessToken
        token.refreshToken = (user as { refreshToken?: string }).refreshToken
        token.merchantId = (user as { merchantId?: string }).merchantId
      }

      return token
    },
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined
      session.merchantId = typeof token.merchantId === 'string' ? token.merchantId : undefined
      return session
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  // logger: {
  //   error(code, ...message) {
  //     log.error(code, message)
  //   },
  //   warn(code, ...message) {
  //     log.warn(code, message)
  //   },
  //   debug(code, ...message) {
  //     log.debug(code, message)
  //   },
  // },
  // debug: process.env.NODE_ENV === 'development',
}

const result = NextAuth(authConfig)
export const handlers: NextAuthResult['handlers'] = result.handlers
export const auth: NextAuthResult['auth'] = result.auth
export const signIn: NextAuthResult['signIn'] = result.signIn
export const signOut: NextAuthResult['signOut'] = result.signOut
