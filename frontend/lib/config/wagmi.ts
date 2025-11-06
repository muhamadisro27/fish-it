import { http, createConfig, createStorage } from 'wagmi'
import { liskSepolia } from './chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Get WalletConnect project ID from env
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Only include WalletConnect if we have a valid project ID
const connectors = [
  injected({
    target: 'metaMask',
  }),
]

// Add WalletConnect only if project ID is provided and valid
if (projectId && projectId !== 'your_project_id_here' && projectId.length > 10) {
  connectors.push(
    walletConnect({
      projectId,
      showQrModal: true,
    })
  )
}

export const config = createConfig({
  chains: [liskSepolia],
  connectors,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
  ssr: true,
  transports: {
    [liskSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

