import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Providers } from './provider'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  )
}
