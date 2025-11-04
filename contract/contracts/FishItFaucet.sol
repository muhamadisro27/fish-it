// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FishItFaucet is Ownable {
    IERC20 public fsht;

    uint256 public constant CLAIM_AMOUNT = 10 * 10 ** 18; // 10 FSHT
    uint256 public constant CLAIM_COOLDOWN = 24 hours;

    mapping(address => uint256) public lastClaimTime;

    event Claimed(address indexed user, uint256 amount, uint256 nextClaimTime);

    constructor(address fshtAddr, address initialOwner) Ownable(initialOwner) {
        fsht = IERC20(fshtAddr);
    }

    function claim() external {
        require(_canClaim(msg.sender), "Cooldown active");

        lastClaimTime[msg.sender] = block.timestamp;
        require(fsht.transfer(msg.sender, CLAIM_AMOUNT), "Transfer failed");

        emit Claimed(
            msg.sender,
            CLAIM_AMOUNT,
            block.timestamp + CLAIM_COOLDOWN
        );
    }

    function _canClaim(address user) private view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + CLAIM_COOLDOWN;
    }

    function getNextClaimTime(address user) external view returns (uint256) {
        if (_canClaim(user)) return block.timestamp;
        return lastClaimTime[user] + CLAIM_COOLDOWN;
    }

    function fundFaucet(uint256 amount) external onlyOwner {
        require(
            fsht.transferFrom(msg.sender, address(this), amount),
            "Fund failed"
        );
    }
}
