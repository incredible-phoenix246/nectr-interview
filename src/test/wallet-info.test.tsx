import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletInfo } from '~/components/wallet/wallet-info'

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
