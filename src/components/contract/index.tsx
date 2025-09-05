'use client'

import { BarChart3, Users, Percent, Shield, ExternalLink } from 'lucide-react'
import { useNECTRContract, formatTokenAmount } from '~/hooks/use-nectr-contract'

export function ContractStats() {
  const { useContractStats } = useNECTRContract()
  const { data: stats, isLoading } = useContractStats()

  if (isLoading) {
    return (
      <div className="border border-white/20 bg-white/10 p-6 backdrop-blur-md">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <BarChart3 className="h-6 w-6" />
          Contract Statistics
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-white/5" data-testid="skeleton" />
          <div className="h-20 bg-white/5" data-testid="skeleton" />
          <div className="h-20 bg-white/5" data-testid="skeleton" />
        </div>
      </div>
    )
  }

  const [totalSupply, totalStaked, stakingRewardRate, minimumStakeAmount] =
    Array.isArray(stats) ? stats : []

  const stakingPercentage =
    totalSupply && totalStaked
      ? (Number(totalStaked) / Number(totalSupply)) * 100
      : 0

  return (
    <div className="bg-card border border-dashed p-6 backdrop-blur-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
        <BarChart3 className="h-6 w-6" />
        Contract Statistics
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Supply */}
        <div className="border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-blue-200">Total Supply</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {totalSupply ? formatTokenAmount(totalSupply, 0) : '0'} NECTR
          </p>
          <p className="mt-1 text-xs text-blue-200">Maximum token supply</p>
        </div>

        {/* Total Staked */}
        <div className="border border-green-500/30 bg-gradient-to-br from-green-600/20 to-green-800/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            <h3 className="text-sm font-medium text-green-200">Total Staked</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {totalStaked ? formatTokenAmount(totalStaked, 0) : '0'} NECTR
          </p>
          <p className="mt-1 text-xs text-green-200">
            {stakingPercentage.toFixed(1)}% of supply staked
          </p>
        </div>

        {/* Staking APY */}
        <div className="border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Percent className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-purple-200">Staking APY</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {stakingRewardRate ? Number(stakingRewardRate) / 100 : 0}%
          </p>
          <p className="mt-1 text-xs text-purple-200">
            Annual percentage yield
          </p>
        </div>

        {/* Minimum Stake */}
        <div className="border border-orange-500/30 bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-400" />
            <h3 className="text-sm font-medium text-orange-200">
              Minimum Stake
            </h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {minimumStakeAmount
              ? formatTokenAmount(minimumStakeAmount, 0)
              : '0'}{' '}
            NECTR
          </p>
          <p className="mt-1 text-xs text-orange-200">
            Required minimum amount
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Contract Address:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-white">
                0xD2afEf...08F6
              </span>
              <a
                href="https://amoy.polygonscan.com/address/0xD2afEf4d43a6a82CA129a3Adf4231587503408F6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Network:</span>
            <span className="text-white">Polygon Amoy</span>
          </div>
        </div>
      </div>

      {/* Staking Progress Bar */}
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm text-gray-300">
          <span>Staking Progress</span>
          <span>{stakingPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
            style={{ width: `${Math.min(stakingPercentage, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {totalStaked && totalSupply
            ? `${formatTokenAmount(totalStaked, 0)} of ${formatTokenAmount(totalSupply, 0)} tokens staked`
            : 'Loading staking data...'}
        </p>
      </div>
    </div>
  )
}
