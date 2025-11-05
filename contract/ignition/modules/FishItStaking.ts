import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import FishItTokenModule from "./FishItToken.js"
import FishItNFTModule from "./FishItNFT.js"
import FishItBaitShopModule from "./FishItBaitShop.js"

export default buildModule("FishItStakingModule", (m) => {
  const { token } = m.useModule(FishItTokenModule)
  const { nft } = m.useModule(FishItNFTModule)
  const { baitShop } = m.useModule(FishItBaitShopModule)
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  const staking = m.contract("FishItStaking", [
    token,
    nft,
    baitShop,
    initialOwner,
  ])

  return { staking, token, nft, baitShop }
})
