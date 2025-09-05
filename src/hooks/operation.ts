import { useState, useCallback } from 'react'
import { useNECTRContract } from './use-nectr-contract'

export function useTokenOperations() {
  const [operationState, setOperationState] = useState<{
    type: 'stake' | 'unstake' | 'claim' | null
    loading: boolean
    error: string | null
    success: boolean
  }>({
    type: null,
    loading: false,
    error: null,
    success: false,
  })

  const { stakeTokens, unstakeTokens, claimRewards } = useNECTRContract()

  const executeOperation = useCallback(
    async (type: 'stake' | 'unstake' | 'claim', amount?: string) => {
      setOperationState({ type, loading: true, error: null, success: false })

      try {
        let result
        switch (type) {
          case 'stake':
            if (!amount) throw new Error('Amount required for staking')
            result = await stakeTokens(amount)
            break
          case 'unstake':
            if (!amount) throw new Error('Amount required for unstaking')
            result = await unstakeTokens(amount)
            break
          case 'claim':
            result = await claimRewards()
            break
        }

        setOperationState({ type, loading: false, error: null, success: true })
        return result
      } catch (error) {
        setOperationState({
          type,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        })
        throw error
      }
    },
    [stakeTokens, unstakeTokens, claimRewards]
  )

  const resetOperationState = useCallback(() => {
    setOperationState({
      type: null,
      loading: false,
      error: null,
      success: false,
    })
  }, [])

  return {
    operationState,
    executeOperation,
    resetOperationState,
  }
}
