'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useNECTRContract } from '~/hooks/use-nectr-contract'
import { Vote, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Proposal {
  id: number
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  endTime: Date
  status: 'active' | 'passed' | 'failed'
  requiredStake: number
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Increase Staking Rewards to 7%',
    description:
      'Proposal to increase the annual staking rewards from 5% to 7% to attract more long-term holders.',
    votesFor: 1250000,
    votesAgainst: 350000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    requiredStake: 100,
  },
  {
    id: 2,
    title: 'Partner with Global Bee Foundation',
    description:
      'Establish partnership to directly fund bee conservation projects with 2% of protocol revenue.',
    votesFor: 890000,
    votesAgainst: 210000,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    requiredStake: 50,
  },
]

export function GovernanceModule() {
  const { address } = useAccount()
  const { useStakedBalance } = useNECTRContract()
  const { data: stakedBalance } = useStakedBalance(address)
  const [, setSelectedProposal] = useState<number | null>(null)

  const userVotingPower = stakedBalance ? Number(stakedBalance) / 1e18 : 0

  const handleVote = (proposalId: number, support: boolean) => {
    toast.success(`Voted ${support ? 'FOR' : 'AGAINST'} proposal ${proposalId}`)
    setSelectedProposal(null)
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Vote className="h-6 w-6 text-purple-400" />
        NECTR Governance
      </h3>

      <div className="mb-4 rounded-lg bg-purple-900/20 p-3">
        <div className="flex items-center justify-between">
          <span className="text-purple-200">Your Voting Power:</span>
          <span className="font-bold text-white">
            {userVotingPower.toFixed(2)} NECTR
          </span>
        </div>
        <p className="mt-1 text-xs text-purple-300">
          Voting power = staked NECTR tokens
        </p>
      </div>

      <div className="space-y-4">
        {mockProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="rounded-lg border border-white/10 bg-black/20 p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <h4 className="font-semibold text-white">{proposal.title}</h4>
              <span
                className={`rounded px-2 py-1 text-xs ${
                  proposal.status === 'active'
                    ? 'bg-blue-600 text-blue-100'
                    : proposal.status === 'passed'
                      ? 'bg-green-600 text-green-100'
                      : 'bg-red-600 text-red-100'
                }`}
              >
                {proposal.status.toUpperCase()}
              </span>
            </div>

            <p className="mb-3 text-sm text-gray-300">{proposal.description}</p>

            <div className="mb-3 grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-200">
                    For: {proposal.votesFor.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-red-400" />
                  <span className="text-xs text-red-200">
                    Against: {proposal.votesAgainst.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>Ends: {proposal.endTime.toLocaleDateString()}</span>
              </div>

              {userVotingPower >= proposal.requiredStake &&
                proposal.status === 'active' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(proposal.id, true)}
                      className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, false)}
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Vote Against
                    </button>
                  </div>
                )}

              {userVotingPower < proposal.requiredStake && (
                <span className="text-xs text-gray-500">
                  Need {proposal.requiredStake} staked NECTR to vote
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
