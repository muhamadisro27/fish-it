// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./FishItNFT.sol";
import "./FishItBaitShop.sol";
import "./FishItTypes.sol";

contract FishItStaking is Ownable, ReentrancyGuard {
    IERC20 public fsht;
    FishItNFT public nft;
    FishItBaitShop public baitShop;

    using FishItTypes for FishItTypes.BaitType;

    enum FishingState {
        Idle,
        Chumming,
        Casting,
        Strike,
        ReadyToClaim
    }

    struct StakeInfo {
        uint256 amount;
        FishItTypes.BaitType baitType;
        uint256 chummingStartTime;
        uint256 castingStartTime;
        uint256 strikeStartTime;
        FishingState state;
        string nftCID; // ✅ Backend stores CID here
    }

    uint256 public constant CASTING_DURATION = 60 seconds;
    uint256 public constant STRIKE_WINDOW = 30 seconds;

    mapping(address => StakeInfo) public stakes;

    event FishingStarted(
        address indexed user,
        uint256 amount,
        FishItTypes.BaitType baitType
    );
    event StateChanged(
        address indexed user,
        FishingState newState,
        uint256 timestamp
    );
    event FishCaught(
        address indexed user,
        uint256 amount,
        FishItTypes.BaitType baitType
    );
    event FishEscaped(
        address indexed user,
        uint256 lostAmount,
        FishItTypes.BaitType lostBait
    );
    event NFTReady(address indexed user, string cid); // ✅ NEW: Backend signals ready
    event NFTClaimed(address indexed user, uint256 tokenId, uint256 reward); // ✅ NEW: User claimed

    constructor(
        address fshtAddr,
        address nftAddr,
        address baitShopAddr,
        address initialOwner
    ) Ownable(initialOwner) {
        fsht = IERC20(fshtAddr);
        nft = FishItNFT(nftAddr);
        baitShop = FishItBaitShop(baitShopAddr);
    }

    // ========================================
    // PHASE 1: CHUMMING
    // ========================================
    function startFishing(
        uint256 amount,
        FishItTypes.BaitType baitType
    ) external nonReentrant {
        require(amount >= 1 * 10 ** 18, "Minimum stake: 1 FSHT");
        require(
            stakes[msg.sender].state == FishingState.Idle,
            "Already fishing"
        );
        require(
            baitShop.baitInventory(msg.sender, baitType) > 0,
            "No bait available"
        );

        require(
            fsht.transferFrom(msg.sender, address(this), amount),
            "Stake transfer failed"
        );
        baitShop.consumeBait(msg.sender, baitType);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            baitType: baitType,
            chummingStartTime: block.timestamp,
            castingStartTime: 0,
            strikeStartTime: 0,
            state: FishingState.Chumming,
            nftCID: ""
        });

        emit FishingStarted(msg.sender, amount, baitType);
        emit StateChanged(msg.sender, FishingState.Chumming, block.timestamp);
    }

    // ========================================
    // PHASE 2: CASTING
    // ========================================
    function enterCastingPhase() external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Chumming, "Not in chumming phase");

        s.castingStartTime = block.timestamp;
        s.state = FishingState.Casting;

        emit StateChanged(msg.sender, FishingState.Casting, block.timestamp);
    }

    // ========================================
    // PHASE 3: STRIKE
    // ========================================
    function enterStrikePhase() external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Casting, "Not in casting phase");
        require(
            block.timestamp >= s.castingStartTime + CASTING_DURATION,
            "Wait 1 minute"
        );

        s.strikeStartTime = block.timestamp;
        s.state = FishingState.Strike;

        emit StateChanged(msg.sender, FishingState.Strike, block.timestamp);
    }

    // ========================================
    // UNSTAKE - Just emit event for backend
    // ========================================
    function unstake() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Strike, "Not in strike phase");

        uint256 timeInStrike = block.timestamp - s.strikeStartTime;

        if (timeInStrike <= STRIKE_WINDOW) {
            // SUCCESS - Emit event for backend to process
            emit FishCaught(msg.sender, s.amount, s.baitType);

            // State stays for backend to set CID
            // Don't change state yet - backend will set it to ReadyToClaim
        } else {
            // FAILED - Fish escaped
            uint256 lostAmount = s.amount;
            FishItTypes.BaitType lostBait = s.baitType;

            require(fsht.transfer(owner(), s.amount), "Burn transfer failed");
            delete stakes[msg.sender];

            emit FishEscaped(msg.sender, lostAmount, lostBait);
        }
    }

    // ========================================
    // BACKEND: Prepare NFT (Owner only)
    // ✅ Backend calls this after generating image
    // ========================================
    function prepareNFT(address user, string memory cid) external onlyOwner {
        StakeInfo storage s = stakes[user];
        require(s.state == FishingState.Strike, "User hasn't unstaked yet");
        require(s.amount > 0, "Invalid stake");
        require(bytes(s.nftCID).length == 0, "Already prepared");

        // Store CID and change state
        s.nftCID = cid;
        s.state = FishingState.ReadyToClaim;

        emit NFTReady(user, cid);
    }

    // ========================================
    // USER: Claim Reward
    // ✅ User calls this after backend prepares NFT
    // ========================================
    function claimReward() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.ReadyToClaim, "NFT not ready yet");
        require(bytes(s.nftCID).length > 0, "No CID available");

        // Mint NFT
        uint256 tokenId = nft.safeMint(msg.sender, s.nftCID);

        // Calculate and transfer reward
        uint256 reward = (s.amount * 1) / 100;
        uint256 total = s.amount + reward;

        delete stakes[msg.sender];

        require(fsht.transfer(msg.sender, total), "Reward transfer failed");

        emit NFTClaimed(msg.sender, tokenId, reward);
    }

    // ========================================
    // View Functions
    // ========================================
    function getStakeInfo(
        address user
    )
        external
        view
        returns (
            uint256 amount,
            FishItTypes.BaitType baitType,
            FishingState state,
            uint256 timeInCurrentState,
            string memory nftCID
        )
    {
        StakeInfo memory s = stakes[user];

        uint256 timeElapsed = 0;
        if (s.state == FishingState.Chumming) {
            timeElapsed = block.timestamp - s.chummingStartTime;
        } else if (s.state == FishingState.Casting) {
            timeElapsed = block.timestamp - s.castingStartTime;
        } else if (s.state == FishingState.Strike) {
            timeElapsed = block.timestamp - s.strikeStartTime;
        }

        return (s.amount, s.baitType, s.state, timeElapsed, s.nftCID);
    }

    function canEnterStrike(address user) external view returns (bool) {
        StakeInfo memory s = stakes[user];
        return
            s.state == FishingState.Casting &&
            block.timestamp >= s.castingStartTime + CASTING_DURATION;
    }

    function getStrikeTimeRemaining(
        address user
    ) external view returns (uint256) {
        StakeInfo memory s = stakes[user];
        if (s.state != FishingState.Strike) return 0;

        uint256 elapsed = block.timestamp - s.strikeStartTime;
        if (elapsed >= STRIKE_WINDOW) return 0;

        return STRIKE_WINDOW - elapsed;
    }

    function getCastingTimeRemaining(
        address user
    ) external view returns (uint256) {
        StakeInfo memory s = stakes[user];
        if (s.state != FishingState.Casting) return 0;

        uint256 elapsed = block.timestamp - s.castingStartTime;
        if (elapsed >= CASTING_DURATION) return 0;

        return CASTING_DURATION - elapsed;
    }

    function isReadyToClaim(address user) external view returns (bool) {
        return stakes[user].state == FishingState.ReadyToClaim;
    }

    function fundContract(uint256 amount) external onlyOwner {
        require(
            fsht.transferFrom(msg.sender, address(this), amount),
            "Fund failed"
        );
    }

    function getBalance() external view returns (uint256) {
        return fsht.balanceOf(address(this));
    }

    // Emergency: Force timeout
    function forceTimeout(address user) external {
        StakeInfo storage s = stakes[user];
        require(s.state == FishingState.Strike, "Not in strike phase");

        uint256 timeInStrike = block.timestamp - s.strikeStartTime;
        require(timeInStrike > STRIKE_WINDOW, "Still in window");

        uint256 lostAmount = s.amount;
        FishItTypes.BaitType lostBait = s.baitType;

        require(fsht.transfer(owner(), s.amount), "Burn transfer failed");
        delete stakes[user];

        emit FishEscaped(user, lostAmount, lostBait);
    }
}
