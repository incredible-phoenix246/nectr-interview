import { inDevEnvironment } from '~/lib/utils'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { polygon, polygonAmoy } from '@reown/appkit/networks'

export const metadata = {
  name: 'NECTR dApp',
  description: 'Decentralized staking ecosystem for NECTR tokens',
  url: inDevEnvironment ? "http://localhost:3000" : process.env.APP_URL as string,
  icons: ['https://nectr-dapp.vercel.app/favicon.ico'],
}
export const amoy = {
  id: 80002,
  name: 'Polygon Amoy Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'POL',
    symbol: 'POL',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [amoy, polygonAmoy, polygon],
})

export const networks = [amoy, polygonAmoy, polygon] as [
  AppKitNetwork,
  ...AppKitNetwork[],
]

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  // siweConfig,
  networks,
  defaultNetwork: amoy,
  metadata,
})

export const config = wagmiAdapter.wagmiConfig
