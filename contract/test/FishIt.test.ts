// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { FishItToken, FishItNFT, FishItBaitShop, FishItFaucet, FishItStaking } from "../typechain-types";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// describe("FishIt Complete Test Suite", function () {
//   // Fixture for deployment
//   async function deployFishItFixture() {
//     const [owner, user1, user2] = await ethers.getSigners();

//     // Deploy Token
//     const FishItToken = await ethers.getContractFactory("FishItToken");
//     const token = await FishItToken.deploy(owner.address);

//     // Deploy NFT
//     const FishItNFT = await ethers.getContractFactory("FishItNFT");
//     const nft = await FishItNFT.deploy(owner.address);

//     // Deploy BaitShop
//     const FishItBaitShop = await ethers.getContractFactory("FishItBaitShop");
//     const baitShop = await FishItBaitShop.deploy(
//       await token.getAddress(),
//       owner.address
//     );

//     // Deploy Faucet
//     const FishItFaucet = await ethers.getContractFactory("FishItFaucet");
//     const faucet = await FishItFaucet.deploy(
//       await token.getAddress(),
//       owner.address
//     );

//     // Deploy Staking
//     const FishItStaking = await ethers.getContractFactory("FishItStaking");
//     const staking = await FishItStaking.deploy(
//       await token.getAddress(),
//       await nft.getAddress(),
//       await baitShop.getAddress(),
//       owner.address
//     );

//     // Setup: Fund contracts
//     await token.approve(await faucet.getAddress(), ethers.parseEther("300000"));
//     await faucet.fundFaucet(ethers.parseEther("300000"));

//     await token.approve(await staking.getAddress(), ethers.parseEther("200000"));
//     await staking.fundContract(ethers.parseEther("200000"));

//     // Setup: Set permissions
//     await nft.setMinter(await staking.getAddress(), true);
//     await baitShop.setConsumer(await staking.getAddress(), true);

//     return { token, nft, baitShop, faucet, staking, owner, user1, user2 };
//   }

//   describe("Deployment", function () {
//     it("Should deploy all contracts", async function () {
//       const { token, nft, baitShop, faucet, staking } = await loadFixture(
//         deployFishItFixture
//       );

//       expect(await token.getAddress()).to.be.properAddress;
//       expect(await nft.getAddress()).to.be.properAddress;
//       expect(await baitShop.getAddress()).to.be.properAddress;
//       expect(await faucet.getAddress()).to.be.properAddress;
//       expect(await staking.getAddress()).to.be.properAddress;
//     });

//     it("Should have correct initial token supply", async function () {
//       const { token } = await loadFixture(deployFishItFixture);
//       const totalSupply = await token.totalSupply();
//       expect(totalSupply).to.equal(ethers.parseEther("1000000"));
//     });

//     it("Should have correct token distribution", async function () {
//       const { token, owner, faucet, staking } = await loadFixture(
//         deployFishItFixture
//       );

//       const ownerBalance = await token.balanceOf(owner.address);
//       const faucetBalance = await token.balanceOf(await faucet.getAddress());
//       const stakingBalance = await token.balanceOf(await staking.getAddress());

//       expect(ownerBalance).to.equal(ethers.parseEther("500000"));
//       expect(faucetBalance).to.equal(ethers.parseEther("300000"));
//       expect(stakingBalance).to.equal(ethers.parseEther("200000"));
//     });

//     it("Should set correct permissions", async function () {
//       const { nft, baitShop, staking } = await loadFixture(deployFishItFixture);

//       const isNFTMinter = await nft.minters(await staking.getAddress());
//       const isBaitConsumer = await baitShop.consumers(await staking.getAddress());

//       expect(isNFTMinter).to.be.true;
//       expect(isBaitConsumer).to.be.true;
//     });
//   });

//   describe("FishItToken", function () {
//     it("Should have correct name and symbol", async function () {
//       const { token } = await loadFixture(deployFishItFixture);
//       expect(await token.name()).to.equal("FishIt Token");
//       expect(await token.symbol()).to.equal("FSHT");
//     });

//     it("Should allow owner to mint", async function () {
//       const { token, owner, user1 } = await loadFixture(deployFishItFixture);
//       await token.mint(user1.address, ethers.parseEther("100"));
//       expect(await token.balanceOf(user1.address)).to.equal(
//         ethers.parseEther("100")
//       );
//     });

//     it("Should not allow non-owner to mint", async function () {
//       const { token, user1, user2 } = await loadFixture(deployFishItFixture);
//       await expect(
//         token.connect(user1).mint(user2.address, ethers.parseEther("100"))
//       ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
//     });

//     it("Should allow users to burn their tokens", async function () {
//       const { token, owner, user1 } = await loadFixture(deployFishItFixture);
//       await token.mint(user1.address, ethers.parseEther("100"));
//       await token.connect(user1).burn(ethers.parseEther("50"));
//       expect(await token.balanceOf(user1.address)).to.equal(
//         ethers.parseEther("50")
//       );
//     });
//   });

//   describe("FishItFaucet", function () {
//     it("Should allow first-time claim", async function () {
//       const { faucet, token, user1 } = await loadFixture(deployFishItFixture);
//       await faucet.connect(user1).claim();
//       expect(await token.balanceOf(user1.address)).to.equal(
//         ethers.parseEther("10")
//       );
//     });

//     it("Should enforce 24h cooldown", async function () {
//       const { faucet, user1 } = await loadFixture(deployFishItFixture);
//       await faucet.connect(user1).claim();
//       await expect(faucet.connect(user1).claim()).to.be.revertedWith(
//         "Cooldown active"
//       );
//     });

//     it("Should allow claim after 24 hours", async function () {
//       const { faucet, token, user1 } = await loadFixture(deployFishItFixture);
//       await faucet.connect(user1).claim();
//       await time.increase(24 * 60 * 60 + 1);
//       await faucet.connect(user1).claim();
//       expect(await token.balanceOf(user1.address)).to.equal(
//         ethers.parseEther("20")
//       );
//     });

//     it("Should emit Claimed event", async function () {
//       const { faucet, user1 } = await loadFixture(deployFishItFixture);
//       await expect(faucet.connect(user1).claim())
//         .to.emit(faucet, "Claimed")
//         .withArgs(user1.address, ethers.parseEther("10"), await time.latest() + 24 * 60 * 60);
//     });
//   });

//   describe("FishItBaitShop", function () {
//     it("Should have correct bait prices", async function () {
//       const { baitShop } = await loadFixture(deployFishItFixture);
//       expect(await baitShop.getBaitPrice(0)).to.equal(ethers.parseEther("1")); // Common
//       expect(await baitShop.getBaitPrice(1)).to.equal(ethers.parseEther("5")); // Rare
//       expect(await baitShop.getBaitPrice(2)).to.equal(ethers.parseEther("10")); // Epic
//       expect(await baitShop.getBaitPrice(3)).to.equal(ethers.parseEther("20")); // Legendary
//     });

//     it("Should allow buying bait", async function () {
//       const { baitShop, token, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       expect(await baitShop.getBaitInventory(user1.address, 0)).to.equal(1);
//     });

//     it("Should deduct correct token amount", async function () {
//       const { baitShop, token, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       const balanceBefore = await token.balanceOf(user1.address);
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("5"));
//       await baitShop.connect(user1).buyBait(1, 1); // Rare = 5 FSHT
//       const balanceAfter = await token.balanceOf(user1.address);
//       expect(balanceBefore - balanceAfter).to.equal(ethers.parseEther("5"));
//     });

//     it("Should allow staking contract to consume bait", async function () {
//       const { baitShop, token, faucet, staking, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
      
//       // Staking contract should be able to consume
//       await baitShop.connect(staking).consumeBait(user1.address, 0);
//       expect(await baitShop.getBaitInventory(user1.address, 0)).to.equal(0);
//     });

//     it("Should emit BaitPurchased event", async function () {
//       const { baitShop, token, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
      
//       await expect(baitShop.connect(user1).buyBait(0, 1))
//         .to.emit(baitShop, "BaitPurchased")
//         .withArgs(user1.address, 0, 1, ethers.parseEther("1"));
//     });
//   });

//   describe("FishItStaking - Complete Flow SUCCESS", function () {
//     it("Should complete full fishing cycle", async function () {
//       const { staking, token, nft, baitShop, faucet, owner, user1 } =
//         await loadFixture(deployFishItFixture);

//       // User gets tokens and bait
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);

//       // Start fishing
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));
//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);

//       let info = await staking.getStakeInfo(user1.address);
//       expect(info.state).to.equal(1); // Chumming

//       // Enter casting
//       await staking.connect(user1).enterCastingPhase();
//       info = await staking.getStakeInfo(user1.address);
//       expect(info.state).to.equal(2); // Casting

//       // Wait 60 seconds
//       await time.increase(60);

//       // Enter strike
//       await staking.connect(user1).enterStrikePhase();
//       info = await staking.getStakeInfo(user1.address);
//       expect(info.state).to.equal(3); // Strike

//       // Unstake within 30s
//       await staking.connect(user1).unstake();

//       // Backend prepares NFT
//       await staking.connect(owner).prepareNFT(user1.address, "QmTestCID");
      
//       info = await staking.getStakeInfo(user1.address);
//       expect(info.state).to.equal(4); // ReadyToClaim
//       expect(info.nftCID).to.equal("QmTestCID");

//       // User claims
//       const balanceBefore = await token.balanceOf(user1.address);
//       await staking.connect(user1).claimReward();

//       // Check NFT received
//       expect(await nft.balanceOf(user1.address)).to.equal(1);

//       // Check tokens with reward (1 + 1%)
//       const balanceAfter = await token.balanceOf(user1.address);
//       expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("1.01"));

//       // Check stake deleted
//       info = await staking.getStakeInfo(user1.address);
//       expect(info.amount).to.equal(0);
//       expect(info.state).to.equal(0); // Idle
//     });

//     it("Should emit all correct events", async function () {
//       const { staking, token, baitShop, faucet, owner, user1 } =
//         await loadFixture(deployFishItFixture);

//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       // FishingStarted event
//       await expect(staking.connect(user1).startFishing(ethers.parseEther("1"), 0))
//         .to.emit(staking, "FishingStarted")
//         .withArgs(user1.address, ethers.parseEther("1"), 0, await time.latest());

//       // StateChanged event for Casting
//       await expect(staking.connect(user1).enterCastingPhase())
//         .to.emit(staking, "StateChanged")
//         .withArgs(user1.address, 2, await time.latest());

//       await time.increase(60);

//       // StateChanged event for Strike
//       await expect(staking.connect(user1).enterStrikePhase())
//         .to.emit(staking, "StateChanged")
//         .withArgs(user1.address, 3, await time.latest());

//       // FishCaught event
//       await expect(staking.connect(user1).unstake())
//         .to.emit(staking, "FishCaught")
//         .withArgs(user1.address, ethers.parseEther("1"), 0, await time.latest());

//       // NFTReady event
//       await expect(staking.connect(owner).prepareNFT(user1.address, "QmTest"))
//         .to.emit(staking, "NFTReady")
//         .withArgs(user1.address, "QmTest", await time.latest());

//       // NFTClaimed event
//       await expect(staking.connect(user1).claimReward())
//         .to.emit(staking, "NFTClaimed");
//     });
//   });

//   describe("FishItStaking - Timeout FAILURE", function () {
//     it("Should burn stake and bait on timeout", async function () {
//       const { staking, token, baitShop, faucet, owner, user1 } =
//         await loadFixture(deployFishItFixture);

//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       const balanceBefore = await token.balanceOf(user1.address);

//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);
//       await staking.connect(user1).enterCastingPhase();
//       await time.increase(60);
//       await staking.connect(user1).enterStrikePhase();

//       // Wait > 30 seconds
//       await time.increase(31);

//       // Unstake after timeout
//       await expect(staking.connect(user1).unstake())
//         .to.emit(staking, "FishEscaped")
//         .withArgs(user1.address, ethers.parseEther("1"), 0, await time.latest());

//       // Check tokens lost (1 bait + 1 stake)
//       const balanceAfter = await token.balanceOf(user1.address);
//       expect(balanceBefore - balanceAfter).to.equal(ethers.parseEther("2"));

//       // Check bait consumed
//       expect(await baitShop.getBaitInventory(user1.address, 0)).to.equal(0);

//       // Check stake deleted
//       const info = await staking.getStakeInfo(user1.address);
//       expect(info.amount).to.equal(0);
//     });

//     it("Should transfer lost tokens to owner", async function () {
//       const { staking, token, baitShop, faucet, owner, user1 } =
//         await loadFixture(deployFishItFixture);

//       const ownerBalanceBefore = await token.balanceOf(owner.address);

//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);
//       await staking.connect(user1).enterCastingPhase();
//       await time.increase(60);
//       await staking.connect(user1).enterStrikePhase();
//       await time.increase(31);
//       await staking.connect(user1).unstake();

//       const ownerBalanceAfter = await token.balanceOf(owner.address);
//       expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(
//         ethers.parseEther("1")
//       );
//     });
//   });

//   describe("Edge Cases", function () {
//     it("Should prevent staking without bait", async function () {
//       const { staking, token, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       await expect(
//         staking.connect(user1).startFishing(ethers.parseEther("1"), 0)
//       ).to.be.revertedWith("No bait available");
//     });

//     it("Should prevent double staking", async function () {
//       const { staking, token, baitShop, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("2"));
//       await baitShop.connect(user1).buyBait(0, 2);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("2"));

//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);

//       await expect(
//         staking.connect(user1).startFishing(ethers.parseEther("1"), 0)
//       ).to.be.revertedWith("Already fishing");
//     });

//     it("Should require minimum stake", async function () {
//       const { staking, token, baitShop, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("0.5"));

//       await expect(
//         staking.connect(user1).startFishing(ethers.parseEther("0.5"), 0)
//       ).to.be.revertedWith("Minimum stake: 1 FSHT");
//     });

//     it("Should enforce 60s wait in casting", async function () {
//       const { staking, token, baitShop, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);
//       await staking.connect(user1).enterCastingPhase();

//       await expect(
//         staking.connect(user1).enterStrikePhase()
//       ).to.be.revertedWith("Wait 1 minute");
//     });

//     it("Should not allow claim before backend prepares", async function () {
//       const { staking, token, baitShop, faucet, user1 } = await loadFixture(
//         deployFishItFixture
//       );
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));

//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);
//       await staking.connect(user1).enterCastingPhase();
//       await time.increase(60);
//       await staking.connect(user1).enterStrikePhase();
//       await staking.connect(user1).unstake();

//       await expect(
//         staking.connect(user1).claimReward()
//       ).to.be.revertedWith("NFT not ready yet");
//     });
//   });

//   describe("Multiple Users", function () {
//     it("Should support multiple concurrent users", async function () {
//       const { staking, token, baitShop, faucet, user1, user2 } =
//         await loadFixture(deployFishItFixture);

//       // User1
//       await faucet.connect(user1).claim();
//       await token
//         .connect(user1)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user1).buyBait(0, 1);
//       await token
//         .connect(user1)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));
//       await staking.connect(user1).startFishing(ethers.parseEther("1"), 0);

//       // User2
//       await faucet.connect(user2).claim();
//       await token
//         .connect(user2)
//         .approve(await baitShop.getAddress(), ethers.parseEther("1"));
//       await baitShop.connect(user2).buyBait(0, 1);
//       await token
//         .connect(user2)
//         .approve(await staking.getAddress(), ethers.parseEther("1"));
//       await staking.connect(user2).startFishing(ethers.parseEther("1"), 0);

//       // Both should have independent stakes
//       const info1 = await staking.getStakeInfo(user1.address);
//       const info2 = await staking.getStakeInfo(user2.address);

//       expect(info1.amount).to.equal(ethers.parseEther("1"));
//       expect(info2.amount).to.equal(ethers.parseEther("1"));
//       expect(info1.state).to.equal(1);
//       expect(info2.state).to.equal(1);
//     });
//   });
// });