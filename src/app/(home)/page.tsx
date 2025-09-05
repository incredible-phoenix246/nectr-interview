'use client'

import { useAccount } from 'wagmi'
import { StakingInterface } from '~/components/stack'
import { ContractStats } from '~/components/contract'
import { WalletInfo } from '~/components/wallet/wallet-info'

export default function Dashboard() {
  const { isConnected } = useAccount()

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          NECTR dApp
        </h1>
        {isConnected ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <WalletInfo />
              <ContractStats />
            </div>

            {/* Right Column */}
            <div>
              <StakingInterface />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-md">
            <p>Connect your wallet to continue</p>
          </div>
        )}
      </div>
    </div>
  )
}
