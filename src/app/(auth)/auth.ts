import { SIWESession } from '@reown/appkit-siwe'
import type { DefaultJWT } from 'next-auth/jwt'
import NextAuth, { type DefaultSession } from 'next-auth'
import { authConfig } from './auth.config'

declare module 'next-auth' {
  interface Session extends SIWESession {
    user: {
      id: string
      address: string
      chainId: string
    } & DefaultSession['user']
  }
  interface User {
    id: string
    address: string
    chainId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: {
      id: string
      address: string
      chainId: string
    }
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
})
