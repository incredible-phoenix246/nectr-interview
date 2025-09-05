import NECTRTokenArtifact from '~/abis/NECTRToken.json'

export const NECTR_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string

export const nectrContract = {
  address: NECTR_CONTRACT_ADDRESS as `0x${string}`,
  abi: NECTRTokenArtifact.abi,
} as const

export const AMOY_CHAIN_ID = process.env.AMOY_CHAIN_ID
  ? parseInt(process.env.AMOY_CHAIN_ID)
  : 80002
