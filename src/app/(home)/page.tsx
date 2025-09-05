'use client'

import { useAccount } from 'wagmi'
import { StakingInterface } from '~/components/stack'
import { ContractStats } from '~/components/contract'
import { WalletInfo } from '~/components/wallet/wallet-info'
import { NewsModule } from '~/components/news-module'
import { SocialFeed } from '~/components/social-feed'
import { Button } from '~/components/ui/button'
import { useAppKit, useAppKitState } from '@reown/appkit/react'

export default function Dashboard() {
  const { isConnected } = useAccount()
  const { open } = useAppKit()
  const { loading } = useAppKitState()

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="space-y-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          NECTR dApp
        </h1>
        {isConnected ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <WalletInfo />
            </div>
            <div>
              <StakingInterface />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-md">
            <Button onClick={() => open()}>
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        )}
      </div>
      <div className="mt-5">
        <ContractStats />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SocialFeed />
        <NewsModule />
      </div>
    </div>
  )
}
