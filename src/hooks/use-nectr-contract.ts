import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { nectrContract, NECTR_CONTRACT_ADDRESS } from '~/utils/web3/contracts'
import { parseEther, formatEther, type Address } from 'viem'

export function useNECTRContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const useBalance = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const useStakedBalance = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getStakedBalance',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const usePendingRewards = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getPendingRewards',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        refetchInterval: 10000,
      },
    })
  }

  const useContractStats = () => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getContractStats',
    })
  }

  const useStakingInfo = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getStakingInfo',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const useStakingDuration = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'getStakingDuration',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const useHasStakedTokens = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'hasStakedTokens',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const useAllowance = (address?: Address) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'allowance',
      args: address ? [address, NECTR_CONTRACT_ADDRESS] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const stakeTokens = async (amount: string) => {
    return writeContract({
      ...nectrContract,
      functionName: 'stake',
      args: [parseEther(amount)],
    })
  }

  const unstakeTokens = async (amount: string) => {
    return writeContract({
      ...nectrContract,
      functionName: 'unstake',
      args: [parseEther(amount)],
    })
  }

  const claimRewards = async () => {
    return writeContract({
      ...nectrContract,
      functionName: 'claimRewards',
    })
  }

  const setStakingRewardRate = async (newRate: number) => {
    return writeContract({
      ...nectrContract,
      functionName: 'setStakingRewardRate',
      args: [BigInt(newRate)],
    })
  }

  const setMinimumStakeAmount = async (newMinimum: string) => {
    return writeContract({
      ...nectrContract,
      functionName: 'setMinimumStakeAmount',
      args: [parseEther(newMinimum)],
    })
  }

  const approveTokens = async (amount: string) => {
    return writeContract({
      ...nectrContract,
      functionName: 'approve',
      args: [NECTR_CONTRACT_ADDRESS, parseEther(amount)],
    })
  }

  return {
    useBalance,
    useStakedBalance,
    usePendingRewards,
    useContractStats,
    useStakingInfo,
    useStakingDuration,
    useHasStakedTokens,
    useAllowance,

    stakeTokens,
    unstakeTokens,
    claimRewards,
    setStakingRewardRate,
    setMinimumStakeAmount,
    approveTokens,

    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  }
}

export const formatTokenAmount = (amount: bigint | undefined, decimals = 4) => {
  if (!amount) return '0'
  return parseFloat(formatEther(amount)).toFixed(decimals)
}

export const formatDuration = (seconds: bigint | undefined) => {
  if (!seconds) return '0s'

  const numSeconds = Number(seconds)
  const days = Math.floor(numSeconds / (24 * 60 * 60))
  const hours = Math.floor((numSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((numSeconds % (60 * 60)) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export const formatStakingInfo = (stakingInfo: readonly [bigint, bigint, bigint] | undefined) => {
  if (!stakingInfo) return null

  const [stakedAmount, pendingRewards, stakingSince] = stakingInfo

  return {
    stakedAmount: formatTokenAmount(stakedAmount),
    pendingRewards: formatTokenAmount(pendingRewards),
    stakingSince: new Date(Number(stakingSince) * 1000),
    stakingDuration: formatDuration(BigInt(Math.floor(Date.now() / 1000)) - stakingSince)
  }
}