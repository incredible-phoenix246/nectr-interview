'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Copy, ExternalLink, LogOut, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatTokenAmount, useNECTRContract } from '~/hooks/use-nectr-contract'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const { useBalance, useStakedBalance, usePendingRewards } = useNECTRContract()
  const [copied, setCopied] = useState(false)

  const { data: balance, isLoading: balanceLoading } = useBalance(address)
  const { data: stakedBalance, isLoading: stakedLoading } =
    useStakedBalance(address)
  const { data: pendingRewards, isLoading: rewardsLoading } =
    usePendingRewards(address)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://amoy.polygonscan.com/address/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md">
        <Wallet className="mx-auto mb-4 h-12 w-12 text-purple-400" />
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Connect Your Wallet
        </h2>
        <p className="mb-6 text-gray-300">
          Connect your wallet to view your NECTR portfolio
        </p>
        <button
          onClick={() => open()}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Wallet Information
        </h2>
        <button
          onClick={() => disconnect()}
          className="rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Wallet Address */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Wallet Address
        </label>
        <div className="flex items-center gap-2 rounded-lg bg-black/20 p-3">
          <span className="flex-1 truncate font-mono text-sm text-white">
            {address}
          </span>
          <button
            onClick={copyAddress}
            className="rounded-md p-2 transition-colors hover:bg-white/10"
            title="Copy address"
          >
            <Copy className="h-4 w-4 text-gray-300" />
          </button>
          <button
            onClick={openInExplorer}
            className="rounded-md p-2 transition-colors hover:bg-white/10"
            title="View on PolygonScan"
          >
            <ExternalLink className="h-4 w-4 text-gray-300" />
          </button>
        </div>
        {copied && (
          <p className="mt-1 text-sm text-green-400">
            Address copied to clipboard!
          </p>
        )}
      </div>

      {/* Token Balances */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* NECTR Balance */}
        <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-purple-200">
            NECTR Balance
          </h3>
          <p className="text-2xl font-bold text-white">
            {balanceLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(balance)} NECTR`
            )}
          </p>
        </div>

        {/* Staked Balance */}
        <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-600/20 to-green-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-green-200">Staked</h3>
          <p className="text-2xl font-bold text-white">
            {stakedLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(stakedBalance)} NECTR`
            )}
          </p>
        </div>

        {/* Pending Rewards */}
        <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-yellow-200">
            Pending Rewards
          </h3>
          <p className="text-2xl font-bold text-white">
            {rewardsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(pendingRewards)} NECTR`
            )}
          </p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Total Portfolio Value</span>
          <span className="text-xl font-semibold text-white">
            {balanceLoading || stakedLoading || rewardsLoading
              ? 'Loading...'
              : `${formatTokenAmount(
                  (balance || 0n) +
                    (stakedBalance || 0n) +
                    (pendingRewards || 0n)
                )} NECTR`}
          </span>
        </div>
      </div>
    </div>
  )
}
