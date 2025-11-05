import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import FishItTokenModule from "./FishItToken.js"

export default buildModule("FishItBaitShopModule", (m) => {
  const { token } = m.useModule(FishItTokenModule)
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  const baitShop = m.contract("FishItBaitShop", [token, initialOwner])

  return { baitShop, token }
})
