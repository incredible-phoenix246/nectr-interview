import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletInfo } from '~/components/wallet/wallet-info'

// Mock next-intl first, before any imports
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'wallet.connect': 'Connect Wallet',
      'wallet.connecting': 'Connecting...',
      'wallet.disconnect': 'Disconnect wallet',
      'wallet.connectPrompt': 'Connect Your Wallet',
      'wallet.connectDescription': 'Connect your wallet to view your NECTR portfolio',
      'wallet.walletAddress': 'Wallet Information',
      'wallet.addressCopied': 'Address copied to clipboard!',
      'wallet.viewOnPolygonScan': 'View on PolygonScan',
      'staking.stakingFor': 'Staking for:',
      'staking.since': 'Since:',
      'staking.nectrBalance': 'NECTR Balance',
      'staking.staked': 'Staked',
      'staking.pendingRewards': 'Pending Rewards',
      'staking.loading': 'Loading...',
      'staking.activeStakingPosition': 'Active staking position',
      'staking.accumulatingRewards': 'Accumulating at 5% APY',
      'staking.totalPortfolioValue': 'Total Portfolio Value',
      'staking.stakingRatio': 'Staking Ratio:',
      'staking.estimatedDailyRewards': 'Est. Daily Rewards:'
    }
    return translations[key] || key
  }),
}))

vi.mock('~/hooks/use-nectr-contract', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNECTRContract: () => ({
      useBalance: () => ({ data: BigInt(0), isLoading: false }),
      useStakedBalance: () => ({ data: BigInt(0), isLoading: false }),
      usePendingRewards: () => ({ data: BigInt(0), isLoading: false }),
      useStakingInfo: () => ({ data: undefined }),
      useStakingDuration: () => ({ data: undefined }),
      useHasStakedTokens: () => ({ data: false }),
    }),
    formatTokenAmount: vi.fn(() => '0'),
    formatDuration: vi.fn(() => '0 days'),
    formatStakingInfo: vi.fn(() => ({})),
  }
})

vi.mock('wagmi', () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
  useDisconnect: () => ({ disconnect: vi.fn() }),
}))

vi.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: vi.fn() }),
}))

describe('WalletInfo', () => {
  it('renders connect wallet prompt when not connected', () => {
    render(<WalletInfo />)

    expect(
      screen.getByRole('heading', { name: /Connect Your Wallet/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Connect your wallet to view your NECTR portfolio/i)
    ).toBeInTheDocument()
  })

  it('renders connect button', () => {
    render(<WalletInfo />)
    expect(
      screen.getByRole('button', { name: /Connect Wallet/i })
    ).toBeInTheDocument()
  })
})
