import type { Address } from 'viem'

export interface ContractConfig {
  address: Address
  abi: readonly unknown[]
}

export interface ContractStats {
  totalSupply: bigint
  totalStaked: bigint
  stakingRewardRate: bigint
  minimumStakeAmount: bigint
}

export interface StakingInfo {
  stakedAmount: bigint
  pendingRewards: bigint
  stakingSince: bigint
}

export interface FormattedStakingInfo {
  stakedAmount: string
  pendingRewards: string
  stakingSince: Date
  stakingDuration: string
}

export type NECTRContractReturn = ReturnType<
  typeof import('~/hooks/use-nectr-contract').useNECTRContract
>

export interface FormattedContractData {
  balance?: string
  stakedBalance?: string
  pendingRewards?: string
  stakingDuration?: string
  hasStakedTokens?: boolean
  contractStats?: {
    totalSupply: string
    totalStaked: string
    stakingRewardRate: string
    minimumStakeAmount: string
  }
}
