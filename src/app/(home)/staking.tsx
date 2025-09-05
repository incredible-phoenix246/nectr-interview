import { useState } from 'react'
import { useNECTRContract } from '~/hooks/use-nectr-contract'

export function StakingTest() {
  const {
    stakeTokens,
    unstakeTokens,
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useNECTRContract()
  const [amount, setAmount] = useState('100')

  const handleStake = async () => {
    try {
      await stakeTokens(amount)
    } catch (err) {
      console.error('Staking failed:', err)
    }
  }

  const handleUnstake = async () => {
    try {
      await unstakeTokens(amount)
    } catch (err) {
      console.error('Unstaking failed:', err)
    }
  }

  const handleClaim = async () => {
    try {
      await claimRewards()
    } catch (err) {
      console.error('Claiming failed:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white"
          placeholder="Amount to stake/unstake"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStake}
          disabled={isPending || isConfirming}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-600"
        >
          {isPending || isConfirming ? 'Processing...' : 'Stake'}
        </button>

        <button
          onClick={handleUnstake}
          disabled={isPending || isConfirming}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-600"
        >
          Unstake
        </button>

        <button
          onClick={handleClaim}
          disabled={isPending || isConfirming}
          className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:bg-gray-600"
        >
          Claim
        </button>
      </div>

      {/* Transaction Status */}
      {(isPending || isConfirming || isConfirmed || error) && (
        <div className="mt-4 rounded border p-3">
          {isPending && (
            <p className="text-yellow-400">Transaction pending...</p>
          )}
          {isConfirming && (
            <p className="text-blue-400">Waiting for confirmation...</p>
          )}
          {isConfirmed && (
            <p className="text-green-400">Transaction confirmed!</p>
          )}
          {error && <p className="text-red-400">Error: {error.message}</p>}
        </div>
      )}
    </div>
  )
}
