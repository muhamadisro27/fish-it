import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("FishItCompleteModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  // 1. Deploy Token
  const token = m.contract("FishItToken", [initialOwner])

  // 2. Deploy NFT
  const nft = m.contract("FishItNFT", [initialOwner])

  // 3. Deploy BaitShop
  const baitShop = m.contract("FishItBaitShop", [token, initialOwner])

  // 4. Deploy Faucet
  const faucet = m.contract("FishItFaucet", [token, initialOwner])

  // 5. Deploy Staking
  const staking = m.contract("FishItStaking", [
    token,
    nft,
    baitShop,
    initialOwner,
  ])

  return { token, nft, baitShop, faucet, staking }
})
