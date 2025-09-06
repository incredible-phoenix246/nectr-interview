import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Providers } from './provider'
import { Outfit } from 'next/font/google'
import { cn } from '~/lib/utils'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NECTR - Decentralized Ecosystem',
  description: 'Stake, earn, and connect with the NECTR community',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersData = await headers()
  const cookies = headersData.get('cookie')
  const locale = await getLocale()
  const messages = await getMessages()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('antialiased', outfit.variable)}>
        <NextIntlClientProvider messages={messages}>
          <Providers cookies={cookies}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
