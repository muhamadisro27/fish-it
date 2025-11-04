// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./FishItTypes.sol";

contract FishItBaitShop is Ownable {
    IERC20 public fsht;

    using FishItTypes for FishItTypes.BaitType;

    struct BaitPrice {
        uint256 common;
        uint256 rare;
        uint256 epic;
        uint256 legendary;
    }

    BaitPrice public prices =
        BaitPrice({
            common: 1 * 10 ** 18,
            rare: 5 * 10 ** 18,
            epic: 10 * 10 ** 18,
            legendary: 20 * 10 ** 18
        });

    mapping(address => mapping(FishItTypes.BaitType => uint256))
        public baitInventory;

    event BaitPurchased(
        address indexed user,
        FishItTypes.BaitType baitType,
        uint256 quantity
    );

    constructor(address fshtAddr, address initialOwner) Ownable(initialOwner) {
        fsht = IERC20(fshtAddr);
    }

    function buyBait(FishItTypes.BaitType baitType, uint256 quantity) external {
        require(quantity > 0, "Quantity must be > 0");

        uint256 price = getBaitPrice(baitType);
        uint256 totalCost = price * quantity;

        require(
            fsht.transferFrom(msg.sender, address(this), totalCost),
            "Payment failed"
        );

        baitInventory[msg.sender][baitType] += quantity;

        emit BaitPurchased(msg.sender, baitType, quantity);
    }

    function getBaitPrice(
        FishItTypes.BaitType baitType
    ) public view returns (uint256) {
        if (baitType == FishItTypes.BaitType.Common) return prices.common;
        if (baitType == FishItTypes.BaitType.Rare) return prices.rare;
        if (baitType == FishItTypes.BaitType.Epic) return prices.epic;
        if (baitType == FishItTypes.BaitType.Legendary) return prices.legendary;
        revert("Invalid bait type");
    }

    function getBaitInventory(
        address user,
        FishItTypes.BaitType baitType
    ) external view returns (uint256) {
        return baitInventory[user][baitType];
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = fsht.balanceOf(address(this));
        require(fsht.transfer(owner(), balance), "Withdraw failed");
    }

    function consumeBait(address user, FishItTypes.BaitType baitType) external {
        require(baitInventory[user][baitType] > 0, "No bait to consume");
        baitInventory[user][baitType] -= 1;
    }
}
