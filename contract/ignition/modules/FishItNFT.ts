import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("FishItNFTModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  const nft = m.contract("FishItNFT", [initialOwner])

  return { nft }
})
