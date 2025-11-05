import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import FishItRootModule from "./FishItRoot.js"

export default buildModule("FishItSetupModule", (m) => {
  const { token, nft, baitShop, faucet, staking } =
    m.useModule(FishItRootModule)

  // Fund Faucet (300k FSHT)
  const faucetAmount = m.getParameter("faucetAmount", 300_000n * 10n ** 18n)
  m.call(token, "approve", [faucet, faucetAmount], { id: "ApproveFaucet" })
  m.call(faucet, "fundFaucet", [faucetAmount], { id: "FundFaucet" })

  // Fund Staking (200k FSHT)
  const stakingAmount = m.getParameter("stakingAmount", 200_000n * 10n ** 18n)
  m.call(token, "approve", [staking, stakingAmount], { id: "ApproveStaking" })
  m.call(staking, "fundContract", [stakingAmount], { id: "FundStaking" })

  // Set NFT Minter
  m.call(nft, "setMinter", [staking, true], { id: "SetNFTMinter" })

  // Set Bait Consumer
  m.call(baitShop, "setConsumer", [staking, true], { id: "SetBaitConsumer" })

  return { token, nft, baitShop, faucet, staking }
})
