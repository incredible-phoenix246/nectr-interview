import {
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from '@reown/appkit-siwe'
import { authSchema } from './schema'
import { inDevEnvironment, PROJECT_ID } from '~/lib/utils'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'NECTR Testnet',
      async authorize(credentials) {
        const projectId = PROJECT_ID
        const validatedCredentials = authSchema.safeParse(credentials)
        if (!validatedCredentials.success) {
          return null
        }
        const { message, signature } = validatedCredentials.data
        const address = getAddressFromMessage(message)
        const chainId = getChainIdFromMessage(message)

        const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        })
        if (!isValid) {
          return null
        }
        return {
          id: address,
          chainId,
          address,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user
        token.sub = user.address
      }
      return token
    },
    async session({ session, token }) {
      if (!token.sub) {
        return session
      }

      session.user = {
        ...session.user,
        address: token.user.address,
        chainId: token.user.chainId,
      }

      return session
    },
  },
  trustHost: true,
  debug: inDevEnvironment,
} satisfies NextAuthConfig
