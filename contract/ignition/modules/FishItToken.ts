import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("FishItTokenModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0))

  const token = m.contract("FishItToken", [initialOwner])

  return { token }
})
