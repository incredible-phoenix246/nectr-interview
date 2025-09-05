'use client'

import { useNECTRContract } from '~/hooks/use-nectr-contract'
import { Leaf, TreePine, Award, TrendingUp } from 'lucide-react'

// Mock bee conservation data tied to staking
const calculateConservationImpact = (totalStaked: bigint) => {
  const stakedNumber = Number(totalStaked) / 1e18
  return {
    beesSupported: Math.floor(stakedNumber * 0.1),
    hiveBoxes: Math.floor(stakedNumber / 1000),
    ecosystemArea: Math.floor(stakedNumber * 0.05),
    co2Offset: Math.floor(stakedNumber * 2.3),
  }
}

export function BeeConservationStats() {
  const { useContractStats } = useNECTRContract()
  const { data: stats } = useContractStats()

  const totalStaked =
    (stats as unknown as Array<bigint | undefined>)?.[1] || BigInt(0)
  const impact = calculateConservationImpact(totalStaked)

  return (
    <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-600/20 to-emerald-800/20 p-6 backdrop-blur-md">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Leaf className="h-6 w-6 text-green-400" />
        Bee Conservation Impact
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-green-900/30 p-3">
          <div className="mb-1 flex items-center gap-2">
            <TreePine className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200">Bees Supported</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {impact.beesSupported.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-green-900/30 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Award className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200">Hive Boxes</span>
          </div>
          <p className="text-2xl font-bold text-white">{impact.hiveBoxes}</p>
        </div>

        <div className="rounded-lg bg-green-900/30 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200">Ecosystem (hectares)</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {impact.ecosystemArea}
          </p>
        </div>

        <div className="rounded-lg bg-green-900/30 p-3">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200">CO₂ Offset (kg)</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {impact.co2Offset.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-green-800/20 p-3">
        <p className="text-sm text-green-200">
          Every NECTR token staked contributes to global bee conservation
          efforts through our partnership with environmental organizations.
        </p>
      </div>
    </div>
  )
}
