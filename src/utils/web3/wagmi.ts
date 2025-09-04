import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { polygon, polygonAmoy } from '@reown/appkit/networks'

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

export const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: amoy,
    metadata: {
        name: 'NECTR dApp',
        description: 'Decentralized staking ecosystem for NECTR tokens',
        url: 'https://nectr-dapp.vercel.app',
        icons: ['https://nectr-dapp.vercel.app/favicon.ico'],
    },
    features: {
        analytics: true,
        email: false,
        socials: ["x", "google", "github"],
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-color-mix': '#8B5CF6',
        '--w3m-color-mix-strength': 20,
        '--w3m-border-radius-master': '12px',
    },
})

export const config = wagmiAdapter.wagmiConfig
