'use client'

import { config } from '~/utils/web3/wagmi'
import { ThemeProvider } from 'next-themes'
import { getQueryClient } from '~/lib/get-query-client'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '~/components/ui/sonner'

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies?: string | null
}) {
  const queryClient = getQueryClient()
  const initialState = cookieToInitialState(config, cookies)

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider
        config={config}
        initialState={initialState}
        reconnectOnMount
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
