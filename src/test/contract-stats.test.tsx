import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ContractStats } from '~/components/contract'

// Mock next-intl first, before any imports
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'stats.contractStatistics': 'Contract Statistics',
      'stats.totalSupply': 'Total Supply',
      'stats.maximumTokenSupply': 'Maximum token supply',
      'stats.totalStaked': 'Total Staked',
      'stats.percentageOfSupplyStaked': '% of supply staked',
      'stats.stakingAPY': 'Staking APY',
      'stats.annualPercentageYield': 'Annual percentage yield',
      'stats.minimumStake': 'Minimum Stake',
      'stats.requiredMinimumAmount': 'Required minimum amount',
      'stats.contractAddress': 'Contract Address:',
      'stats.network': 'Network:',
      'stats.polygonAmoy': 'Polygon Amoy',
      'stats.stakingProgress': 'Staking Progress',
      'stats.tokensStaked': 'tokens staked',
      'stats.loadingStakingData': 'Loading staking data...'
    }
    return translations[key] || key
  }),
}))

vi.mock('~/hooks/use-nectr-contract', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNECTRContract: () => ({
      useContractStats: () => mockUseContractStats(),
    }),
    formatTokenAmount: vi.fn((val: bigint | number) =>
      typeof val === 'bigint' ? val.toString() : String(val)
    ),
  }
})

let mockUseContractStats: () => { data: unknown; isLoading: boolean }

describe('ContractStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton when stats are loading', () => {
    mockUseContractStats = () => ({ data: undefined, isLoading: true })
    render(<ContractStats />)

    expect(
      screen.getByRole('heading', { name: /Contract Statistics/i })
    ).toBeInTheDocument()

    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('renders stats when loaded', () => {
    mockUseContractStats = () => ({
      isLoading: false,
      data: [BigInt(1000), BigInt(250), BigInt(500), BigInt(10)],
    })

    render(<ContractStats />)

    expect(screen.getByText(/1000 NECTR/i)).toBeInTheDocument()
    expect(screen.getByText(/250 NECTR/i)).toBeInTheDocument()
    expect(screen.getByText(/% of supply staked/i)).toBeInTheDocument()
    expect(screen.getByText(/5%/i)).toBeInTheDocument()
    expect(screen.getByText(/10 NECTR/i)).toBeInTheDocument()
    expect(screen.getByText(/0xD2afEf...08F6/i)).toBeInTheDocument()
    expect(screen.getByText(/Polygon Amoy/i)).toBeInTheDocument()

    const progressSection = screen
      .getByText(/Staking Progress/i)
      .closest('div')!
    expect(within(progressSection).getByText(/25.0%/i)).toBeInTheDocument()

    expect(screen.getByText(/250 of 1000 tokens staked/i)).toBeInTheDocument()
  })
})
