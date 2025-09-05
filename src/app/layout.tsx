import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Providers } from './provider'
import { Outfit } from 'next/font/google'
import { cn } from '~/lib/utils'

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased', outfit.variable)}>
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  )
}
