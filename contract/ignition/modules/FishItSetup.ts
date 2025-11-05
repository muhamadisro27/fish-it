import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import FishItCompleteModule from "./FishItComplete.js"

export default buildModule("FishItSetupModule", (m) => {
  const { token, nft, baitShop, faucet, staking } =
    m.useModule(FishItCompleteModule)

  // Fund Faucet (300k FSHT)
  const faucetAmount = m.getParameter("faucetAmount", 300_000n * 10n ** 18n)
  m.call(token, "approve", [faucet, faucetAmount])
  m.call(faucet, "fundFaucet", [faucetAmount])

  // Fund Staking (200k FSHT)
  const stakingAmount = m.getParameter("stakingAmount", 200_000n * 10n ** 18n)
  m.call(token, "approve", [staking, stakingAmount])
  m.call(staking, "fundContract", [stakingAmount])

  // Set NFT Minter
  m.call(nft, "setMinter", [staking, true])

  // Set Bait Consumer
  m.call(baitShop, "setConsumer", [staking, true])

  return { token, nft, baitShop, faucet, staking }
})
