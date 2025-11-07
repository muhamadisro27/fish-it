// Contract Addresses
export const CONTRACTS = {
  FishItToken: process.env.NEXT_PUBLIC_FSHT_TOKEN_ADDRESS as `0x${string}`,
  FishItNFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  FishItBaitShop: process.env.NEXT_PUBLIC_BAITSHOP_ADDRESS as `0x${string}`,
  FishItFaucet: process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`,
  FishItStaking: process.env.NEXT_PUBLIC_STAKING_ADDRESS as `0x${string}`,
} as const

// Verify all addresses are set
Object.entries(CONTRACTS).forEach(([name, address]) => {
  if (!address || address === undefined) {
    console.error(`Missing contract address for ${name}`)
  }
})

