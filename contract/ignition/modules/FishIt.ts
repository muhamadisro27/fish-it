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
