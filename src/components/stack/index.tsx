'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Coins, TrendingUp, Gift, AlertTriangle } from 'lucide-react'
import { formatTokenAmount, useNECTRContract } from '~/hooks/use-nectr-contract'

export function StakingInterface() {
  const { address } = useAccount()
  const {
    useBalance,
    useStakedBalance,
    usePendingRewards,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  } = useNECTRContract()

  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')

  const { data: balance } = useBalance(address)
  const { data: stakedBalance } = useStakedBalance(address)
  const { data: pendingRewards } = usePendingRewards(address)

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return

    try {
      await stakeTokens(stakeAmount)
      setStakeAmount('')
    } catch (err) {
      console.error('Staking failed:', err)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return

    try {
      await unstakeTokens(unstakeAmount)
      setUnstakeAmount('')
    } catch (err) {
      console.error('Unstaking failed:', err)
    }
  }

  const handleClaimRewards = async () => {
    try {
      await claimRewards()
    } catch (err) {
      console.error('Claiming rewards failed:', err)
    }
  }

  const setMaxStake = () => {
    if (balance) {
      setStakeAmount(formatTokenAmount(balance as bigint | undefined, 6))
    }
  }

  const setMaxUnstake = () => {
    if (stakedBalance) {
      setUnstakeAmount(
        formatTokenAmount(stakedBalance as bigint | undefined, 6)
      )
    }
  }

  const isStakeDisabled =
    !stakeAmount || parseFloat(stakeAmount) <= 0 || isPending || isConfirming
  const isUnstakeDisabled =
    !unstakeAmount ||
    parseFloat(unstakeAmount) <= 0 ||
    isPending ||
    isConfirming
  const isClaimDisabled =
    !pendingRewards || pendingRewards === BigInt(0) || isPending || isConfirming

  // Validation checks
  const stakeAmountNum = parseFloat(stakeAmount || '0')
  const unstakeAmountNum = parseFloat(unstakeAmount || '0')
  const availableBalance = balance
    ? parseFloat(formatTokenAmount(balance as bigint | undefined, 6))
    : 0
  const availableStaked = stakedBalance
    ? parseFloat(formatTokenAmount(stakedBalance as bigint | undefined, 6))
    : 0

  const stakeError =
    stakeAmountNum > availableBalance
      ? 'Insufficient balance'
      : stakeAmountNum > 0 && stakeAmountNum < 10
        ? 'Minimum stake is 10 NECTR'
        : null

  const unstakeError =
    unstakeAmountNum > availableStaked ? 'Insufficient staked balance' : null

  return (
    <div className="bg-card border border-dashed p-6 backdrop-blur-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
        <Coins className="h-6 w-6" />
        Staking Interface
      </h2>

      {/* Staking Section */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Stake NECTR Tokens
        </h3>

        <div className="bg-background mb-4 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Amount to Stake</label>
            <span className="text-sm">
              Available: {formatTokenAmount(balance as bigint | undefined)}{' '}
              NECTR
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                step="0.01"
                min="0"
              />
              <button
                onClick={setMaxStake}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                MAX
              </button>
            </div>

            <button
              onClick={handleStake}
              disabled={isStakeDisabled || !!stakeError}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
            >
              {isPending || isConfirming ? 'Staking...' : 'Stake'}
            </button>
          </div>

          {stakeError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4" />
              {stakeError}
            </div>
          )}

          <p className="mt-2 text-xs text-gray-400">
            Minimum stake: 10 NECTR • Current APY: 5%
          </p>
        </div>
      </div>

      {/* Unstaking Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-white">Unstake Tokens</h3>

        <div className="bg-background mb-4 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Amount to Unstake
            </label>
            <span className="text-sm text-gray-400">
              Staked: {formatTokenAmount(stakedBalance as bigint | undefined)}{' '}
              NECTR
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                step="0.01"
                min="0"
              />
              <button
                onClick={setMaxUnstake}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                MAX
              </button>
            </div>

            <button
              onClick={handleUnstake}
              disabled={isUnstakeDisabled || !!unstakeError}
              className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
            >
              {isPending || isConfirming ? 'Unstaking...' : 'Unstake'}
            </button>
          </div>

          {unstakeError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4" />
              {unstakeError}
            </div>
          )}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="border border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
          <Gift className="h-5 w-5 text-yellow-400" />
          Pending Rewards
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {formatTokenAmount(pendingRewards as bigint | undefined)} NECTR
            </p>
            <p className="text-sm text-yellow-200">
              Rewards accumulate every second
            </p>
          </div>

          <button
            onClick={handleClaimRewards}
            disabled={isClaimDisabled}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-yellow-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
          >
            {isPending || isConfirming ? 'Claiming...' : 'Claim Rewards'}
          </button>
        </div>
      </div>

      {/* Transaction Status */}
      {(isPending || isConfirming || isConfirmed || error) && (
        <div className="mt-4 border border-white/20 bg-white/5 p-4">
          {isPending && (
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
              <span>Transaction pending...</span>
            </div>
          )}
          {isConfirming && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="h-4 w-4 animate-pulse rounded-full bg-blue-400"></div>
              <span>Waiting for confirmation...</span>
            </div>
          )}
          {isConfirmed && (
            <div className="text-green-400">
              ✅ Transaction confirmed!
              {hash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:text-green-300"
                >
                  View on PolygonScan
                </a>
              )}
            </div>
          )}
          {error && (
            <div className="text-red-400">❌ Error: {error.message}</div>
          )}
        </div>
      )}
    </div>
  )
}
