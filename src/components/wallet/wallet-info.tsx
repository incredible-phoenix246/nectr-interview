'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Copy, ExternalLink, LogOut, Wallet, Clock } from 'lucide-react'
import { useState } from 'react'
import {
  formatTokenAmount,
  formatDuration,
  formatStakingInfo,
  useNECTRContract,
} from '~/hooks/use-nectr-contract'
import { Button } from '../ui/button'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const {
    useBalance,
    useStakedBalance,
    usePendingRewards,
    useStakingInfo,
    useStakingDuration,
    useHasStakedTokens,
  } = useNECTRContract()
  const [copied, setCopied] = useState(false)

  const { data: balance, isLoading: balanceLoading } = useBalance(address)
  const { data: stakedBalance, isLoading: stakedLoading } =
    useStakedBalance(address)
  const { data: pendingRewards, isLoading: rewardsLoading } =
    usePendingRewards(address)
  const { data: stakingInfo } = useStakingInfo(address)
  const { data: stakingDuration } = useStakingDuration(address)
  const { data: hasStaked } = useHasStakedTokens(address)

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

  const formattedStakingInfo = formatStakingInfo(
    stakingInfo as readonly [bigint, bigint, bigint] | undefined
  )

  if (!isConnected) {
    return (
      <div className="rounded-xl border p-6 text-center backdrop-blur-md">
        <Wallet className="mx-auto mb-4 h-12 w-12" />
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Connect Your Wallet
        </h2>
        <p className="mb-6">Connect your wallet to view your NECTR portfolio</p>
        <button
          onClick={() => open()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="bg-card border border-dashed p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Wallet Information</h2>
        <Button
          onClick={() => disconnect()}
          className="p-2 transition-colors"
          title="Disconnect wallet"
          variant="outline"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Wallet Address</label>
        <div className="bg-background flex items-center gap-2 rounded p-3">
          <span className="flex-1 truncate font-mono text-sm text-white">
            {typeof address === 'string' ? address : ''}
          </span>
          <Button
            onClick={copyAddress}
            className="p-1 transition-colors"
            title="Copy address"
            variant="outline"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            onClick={openInExplorer}
            className="p-1 transition-colors hover:bg-white/10"
            title="View on PolygonScan"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        {copied && (
          <p className="mt-1 text-sm text-green-400">
            Address copied to clipboard!
          </p>
        )}
      </div>
      {Boolean(hasStaked) && Boolean(stakingDuration) && (
        <div className="mb-4 border border-blue-500/30 bg-blue-600/20 p-3">
          <div className="flex items-center gap-2 text-blue-200">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Staking for:{' '}
              {formatDuration(stakingDuration as bigint | undefined)}
            </span>
          </div>
          {formattedStakingInfo?.stakingSince && (
            <p className="mt-1 text-xs text-blue-300">
              Since: {formattedStakingInfo.stakingSince.toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Token Balances */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* NECTR Balance */}
        <div className="border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-purple-200">
            NECTR Balance
          </h3>
          <p className="text-2xl font-bold text-white">
            {balanceLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(balance as bigint | undefined)} NECTR`
            )}
          </p>
        </div>

        {/* Staked Balance */}
        <div className="border border-green-500/30 bg-gradient-to-br from-green-600/20 to-green-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-green-200">Staked</h3>
          <p className="text-2xl font-bold text-white">
            {stakedLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(stakedBalance as bigint | undefined)} NECTR`
            )}
          </p>
          {Boolean(hasStaked) && (
            <p className="mt-1 text-xs text-green-300">
              Active staking position
            </p>
          )}
        </div>

        {/* Pending Rewards */}
        <div className="border border-yellow-500/30 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-4">
          <h3 className="mb-1 text-sm font-medium text-yellow-200">
            Pending Rewards
          </h3>
          <p className="text-2xl font-bold text-white">
            {rewardsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${formatTokenAmount(pendingRewards as bigint | undefined)} NECTR`
            )}
          </p>
          {Boolean(hasStaked) && (
            <p className="mt-1 text-xs text-yellow-300">
              Accumulating at 5% APY
            </p>
          )}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="">Total Portfolio Value</span>
          <span className="text-xl font-semibold text-white">
            {balanceLoading || stakedLoading || rewardsLoading
              ? 'Loading...'
              : `${formatTokenAmount(
                  ((balance as bigint | undefined) ?? BigInt(0)) +
                    ((stakedBalance as bigint | undefined) ?? BigInt(0)) +
                    ((pendingRewards as bigint | undefined) ?? BigInt(0))
                )} NECTR`}
          </span>
        </div>

        {Boolean(hasStaked) && (
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Staking Ratio:</span>
              <span className="text-white">
                {typeof balance === 'bigint' &&
                typeof stakedBalance === 'bigint' &&
                balance + stakedBalance > BigInt(0)
                  ? `${Math.round(Number(stakedBalance * BigInt(100)) / Number(balance + stakedBalance))}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Daily Rewards:</span>
              <span className="text-white">
                {typeof stakedBalance === 'bigint'
                  ? `${formatTokenAmount((stakedBalance * BigInt(500)) / BigInt(10000) / BigInt(365), 6)} NECTR`
                  : '0 NECTR'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
