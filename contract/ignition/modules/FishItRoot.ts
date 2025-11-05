import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("FishItRootModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  const token = m.contract("FishItToken", [initialOwner])
  const nft = m.contract("FishItNFT", [initialOwner])
  const baitShop = m.contract("FishItBaitShop", [token, initialOwner])
  const faucet = m.contract("FishItFaucet", [token, initialOwner])
  const staking = m.contract("FishItStaking", [
    token,
    nft,
    baitShop,
    initialOwner,
  ])

  return { token, nft, baitShop, faucet, staking }
})
