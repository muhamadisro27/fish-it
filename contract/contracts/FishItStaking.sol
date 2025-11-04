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
        Strike
    }

    struct StakeInfo {
        uint256 amount;
        FishItTypes.BaitType baitType;
        uint256 chummingStartTime;
        uint256 castingStartTime;
        uint256 strikeStartTime;
        FishingState state;
    }

    uint256 public constant CASTING_DURATION = 60 seconds; // ✅ FIXED: Wait 1 minute in CASTING
    uint256 public constant STRIKE_WINDOW = 30 seconds; // 30 seconds to unstake

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
    event NFTMinted(address indexed user, string cid, uint256 reward);

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
    // PHASE 1: CHUMMING (Instant start)
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

        // Transfer stake tokens
        require(
            fsht.transferFrom(msg.sender, address(this), amount),
            "Stake transfer failed"
        );

        // Consume bait from BaitShop
        baitShop.consumeBait(msg.sender, baitType);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            baitType: baitType,
            chummingStartTime: block.timestamp,
            castingStartTime: 0,
            strikeStartTime: 0,
            state: FishingState.Chumming
        });

        emit FishingStarted(msg.sender, amount, baitType);
        emit StateChanged(msg.sender, FishingState.Chumming, block.timestamp);
    }

    // ========================================
    // PHASE 2: CASTING (Instant transition, no wait)
    // ========================================
    function enterCastingPhase() external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Chumming, "Not in chumming phase");

        s.castingStartTime = block.timestamp;
        s.state = FishingState.Casting;

        emit StateChanged(msg.sender, FishingState.Casting, block.timestamp);
    }

    // ========================================
    // PHASE 3: STRIKE (After 1 minute in CASTING)
    // ========================================
    function enterStrikePhase() external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Casting, "Not in casting phase");
        require(
            block.timestamp >= s.castingStartTime + CASTING_DURATION,
            "Wait 1 minute"
        ); // ✅ FIXED

        s.strikeStartTime = block.timestamp;
        s.state = FishingState.Strike;

        emit StateChanged(msg.sender, FishingState.Strike, block.timestamp);
    }

    function unstake() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(s.state == FishingState.Strike, "Not in strike phase");

        uint256 timeInStrike = block.timestamp - s.strikeStartTime;

        // Check if within 30 second window
        if (timeInStrike <= STRIKE_WINDOW) {
            // SUCCESS - Fish caught!
            // ✅ FIXED: Just emit event with stake amount and bait type
            // Backend will calculate RNG
            emit FishCaught(msg.sender, s.amount, s.baitType);

            // Keep stake data for mintNFT
            s.state = FishingState.Idle;
        } else {
            // FAILED - Fish escaped, burn everything
            uint256 lostAmount = s.amount;
            FishItTypes.BaitType lostBait = s.baitType;

            // Burn tokens (send to owner or burn address)
            require(fsht.transfer(owner(), s.amount), "Burn transfer failed");

            delete stakes[msg.sender];

            emit FishEscaped(msg.sender, lostAmount, lostBait);
        }
    }

    // ========================================
    // Mint NFT & Return Rewards (Owner/Backend)
    // ========================================
    function mintNFT(
        address user,
        string memory cid
    ) external onlyOwner nonReentrant {
        StakeInfo storage s = stakes[user];
        require(
            s.state == FishingState.Idle && s.amount > 0,
            "Invalid stake state"
        );

        // Mint NFT
        nft.safeMint(user, cid);

        // Calculate reward (1% base)
        uint256 reward = (s.amount * 1) / 100;
        uint256 total = s.amount + reward;

        delete stakes[user];

        // Return stake + reward
        require(fsht.transfer(user, total), "Reward transfer failed");

        emit NFTMinted(user, cid, reward);
    }

    // ========================================
    // Emergency: Force timeout check
    // ========================================
    function forceTimeout(address user) external {
        StakeInfo storage s = stakes[user];
        require(s.state == FishingState.Strike, "Not in strike phase");

        uint256 timeInStrike = block.timestamp - s.strikeStartTime;
        require(timeInStrike > STRIKE_WINDOW, "Still in window");

        // Fish escaped
        uint256 lostAmount = s.amount;
        FishItTypes.BaitType lostBait = s.baitType;

        require(fsht.transfer(owner(), s.amount), "Burn transfer failed");
        delete stakes[user];

        emit FishEscaped(user, lostAmount, lostBait);
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
            uint256 timeInCurrentState
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

        return (s.amount, s.baitType, s.state, timeElapsed);
    }

    function canEnterStrike(address user) external view returns (bool) {
        StakeInfo memory s = stakes[user];
        return
            s.state == FishingState.Casting &&
            block.timestamp >= s.castingStartTime + CASTING_DURATION; // ✅ FIXED
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

    // Owner functions
    function fundContract(uint256 amount) external onlyOwner {
        require(
            fsht.transferFrom(msg.sender, address(this), amount),
            "Fund failed"
        );
    }

    function getBalance() external view returns (uint256) {
        return fsht.balanceOf(address(this));
    }
}
