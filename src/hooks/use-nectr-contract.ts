import { parseEther, formatEther } from 'viem'
import { nectrContract } from '~/utils/web3/contracts'
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'

export function useNECTRContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const useBalance = (address?: `0x${string}`) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const useStakedBalance = (address?: `0x${string}`) => {
    return useReadContract({
      ...nectrContract,
      functionName: 'stakedBalances',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  const usePendingRewards = (address?: `0x${string}`) => {
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

  // Write functions
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

  return {
    // Read hooks
    useBalance,
    useStakedBalance,
    usePendingRewards,
    useContractStats,

    // Write functions
    stakeTokens,
    unstakeTokens,
    claimRewards,

    // Transaction state
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
