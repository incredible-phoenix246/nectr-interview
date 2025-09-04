'use client'

import { useAccount } from 'wagmi'

export default function Dashboard() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            NECTR Ecosystem
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Stake, earn, and connect with the community
          </p>

          <div className="z-[50000000] flex justify-center">
            <w3m-button />
          </div>
        </div>

        {isConnected ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* <WalletInfo />
              <ContractStats /> */}
            </div>

            {/* Right Column */}
            <div>{/* <StakingInterface /> */}</div>
          </div>
        ) : (
          <div className="text-center text-gray-300">
            <p className="text-lg">Connect your wallet to start using NECTR</p>
          </div>
        )}
      </div>
    </div>
  )
}
