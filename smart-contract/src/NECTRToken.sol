// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NECTRToken
 * @dev ERC20 token with staking functionality for the NECTR ecosystem
 * @notice This contract allows users to stake NECTR tokens and earn rewards
 */
contract NECTRToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    // Staking related storage
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingTimestamp;
    mapping(address => uint256) public accumulatedRewards;

    // Staking parameters
    uint256 public stakingRewardRate = 500; // 5% APY (500 basis points)
    uint256 public constant BASIS_POINTS = 10_000;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

    // Total staked tokens
    uint256 public totalStaked;

    // Minimum staking amount (10 NECTR)
    uint256 public minimumStakeAmount = 10 * 10 ** decimals();

    // Events
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event StakingRewardRateUpdated(uint256 oldRate, uint256 newRate);
    event MinimumStakeAmountUpdated(uint256 oldAmount, uint256 newAmount);

    /**
     * @dev Constructor that mints initial supply to deployer
     */
    constructor() ERC20("NECTR Token", "NECTR") Ownable(msg.sender) {
        // Mint 1 million tokens to deployer
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    /**
     * @dev Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     * @return success True if staking was successful
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused returns (bool success) {
        require(amount > 0, "Cannot stake 0 tokens");
        require(amount >= minimumStakeAmount, "Amount below minimum stake");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Update rewards before changing staked balance
        _updateRewards(msg.sender);

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        // Update staking data
        stakedBalances[msg.sender] += amount;
        totalStaked += amount;
        stakingTimestamp[msg.sender] = block.timestamp;

        emit Staked(msg.sender, amount, block.timestamp);

        return true;
    }

    /**
     * @dev Unstake tokens and claim rewards
     * @param amount Amount of tokens to unstake
     * @return success True if unstaking was successful
     * @return rewardsClaimed Amount of rewards claimed
     */
    function unstake(uint256 amount)
        external
        nonReentrant
        returns (bool success, uint256 rewardsClaimed)
    {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");

        // Update rewards before changing staked balance
        _updateRewards(msg.sender);

        // Calculate and transfer rewards
        uint256 rewards = accumulatedRewards[msg.sender];
        accumulatedRewards[msg.sender] = 0;

        // Update staking data
        stakedBalances[msg.sender] -= amount;
        totalStaked -= amount;

        if (stakedBalances[msg.sender] > 0) {
            stakingTimestamp[msg.sender] = block.timestamp;
        }

        // Transfer staked tokens back to user
        _transfer(address(this), msg.sender, amount);

        // Mint rewards to user
        if (rewards > 0) {
            _mint(msg.sender, rewards);
        }

        emit Unstaked(msg.sender, amount, rewards);

        return (true, rewards);
    }

    /**
     * @dev Claim accumulated rewards without unstaking
     * @return success True if claim was successful
     * @return rewardsClaimed Amount of rewards claimed
     */
    function claimRewards() external nonReentrant returns (bool success, uint256 rewardsClaimed) {
        require(stakedBalances[msg.sender] > 0, "No tokens staked");

        _updateRewards(msg.sender);

        uint256 rewards = accumulatedRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");

        accumulatedRewards[msg.sender] = 0;
        stakingTimestamp[msg.sender] = block.timestamp;

        // Mint rewards to user
        _mint(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);

        return (true, rewards);
    }

    /**
     * @dev Get pending rewards for a user
     * @param user Address to check rewards for
     * @return pendingRewards Pending rewards amount
     */
    function getPendingRewards(address user) external view returns (uint256 pendingRewards) {
        if (stakedBalances[user] == 0) {
            return accumulatedRewards[user];
        }

        uint256 stakingDuration = block.timestamp - stakingTimestamp[user];
        uint256 newRewards = (stakedBalances[user] * stakingRewardRate * stakingDuration)
            / (BASIS_POINTS * SECONDS_PER_YEAR);

        return accumulatedRewards[user] + newRewards;
    }

    /**
     * @dev Get comprehensive staking info for a user
     * @param user Address to get info for
     * @return stakedAmount Amount currently staked
     * @return pendingRewards Pending rewards
     * @return stakingSince Timestamp when staking started
     */
    function getStakingInfo(address user)
        external
        view
        returns (uint256 stakedAmount, uint256 pendingRewards, uint256 stakingSince)
    {
        stakedAmount = stakedBalances[user];
        pendingRewards = this.getPendingRewards(user);
        stakingSince = stakingTimestamp[user];
    }

    /**
     * @dev Internal function to update rewards for a user
     * @param user Address to update rewards for
     */
    function _updateRewards(address user) internal {
        if (stakedBalances[user] > 0) {
            uint256 stakingDuration = block.timestamp - stakingTimestamp[user];
            uint256 newRewards = (stakedBalances[user] * stakingRewardRate * stakingDuration)
                / (BASIS_POINTS * SECONDS_PER_YEAR);
            accumulatedRewards[user] += newRewards;
        }
    }

    // Owner functions

    /**
     * @dev Update staking reward rate (only owner)
     * @param newRate New reward rate in basis points (e.g., 500 = 5%)
     * @return success True if update was successful
     */
    function setStakingRewardRate(uint256 newRate) external onlyOwner returns (bool success) {
        require(newRate <= 2000, "Rate cannot exceed 20%"); // Max 20% APY

        uint256 oldRate = stakingRewardRate;
        stakingRewardRate = newRate;

        emit StakingRewardRateUpdated(oldRate, newRate);

        return true;
    }

    /**
     * @dev Set minimum stake amount (only owner)
     * @param newMinimum New minimum stake amount
     * @return success True if update was successful
     */
    function setMinimumStakeAmount(uint256 newMinimum) external onlyOwner returns (bool success) {
        require(newMinimum > 0, "Minimum must be greater than 0");

        uint256 oldAmount = minimumStakeAmount;
        minimumStakeAmount = newMinimum;

        emit MinimumStakeAmountUpdated(oldAmount, newMinimum);

        return true;
    }

    /**
     * @dev Pause contract (only owner)
     * @return success True if pause was successful
     */
    function pause() external onlyOwner returns (bool success) {
        _pause();
        return true;
    }

    /**
     * @dev Unpause contract (only owner)
     * @return success True if unpause was successful
     */
    function unpause() external onlyOwner returns (bool success) {
        _unpause();
        return true;
    }

    /**
     * @dev Emergency withdrawal function (only owner, when paused)
     * @param to Address to send tokens to
     * @param amount Amount to withdraw
     * @return success True if withdrawal was successful
     */
    function emergencyWithdraw(
        address to,
        uint256 amount
    )
        external
        onlyOwner
        whenPaused
        returns (bool success)
    {
        require(to != address(0), "Invalid address");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        _transfer(address(this), to, amount);

        return true;
    }

    /**
     * @dev Get contract stats for frontend display
     * @return totalSupply_ Total token supply
     * @return totalStaked_ Total tokens currently staked
     * @return stakingRewardRate_ Current reward rate in basis points
     * @return minimumStakeAmount_ Minimum amount required to stake
     */
    function getContractStats()
        external
        view
        returns (
            uint256 totalSupply_,
            uint256 totalStaked_,
            uint256 stakingRewardRate_,
            uint256 minimumStakeAmount_
        )
    {
        totalSupply_ = totalSupply();
        totalStaked_ = totalStaked;
        stakingRewardRate_ = stakingRewardRate;
        minimumStakeAmount_ = minimumStakeAmount;
    }

    /**
     * @dev Get staked balance for a specific user
     * @param user Address to check
     * @return balance Amount of tokens staked by the user
     */
    function getStakedBalance(address user) external view returns (uint256 balance) {
        return stakedBalances[user];
    }

    /**
     * @dev Get staking timestamp for a specific user
     * @param user Address to check
     * @return timestamp When the user started staking (or last updated)
     */
    function getStakingTimestamp(address user) external view returns (uint256 timestamp) {
        return stakingTimestamp[user];
    }

    /**
     * @dev Get accumulated rewards for a specific user
     * @param user Address to check
     * @return rewards Amount of accumulated rewards
     */
    function getAccumulatedRewards(address user) external view returns (uint256 rewards) {
        return accumulatedRewards[user];
    }

    /**
     * @dev Get current staking reward rate
     * @return rate Current reward rate in basis points
     */
    function getStakingRewardRate() external view returns (uint256 rate) {
        return stakingRewardRate;
    }

    /**
     * @dev Get total amount of staked tokens
     * @return total Total tokens currently staked in the contract
     */
    function getTotalStaked() external view returns (uint256 total) {
        return totalStaked;
    }

    /**
     * @dev Get minimum stake amount
     * @return minimum Minimum amount required to stake
     */
    function getMinimumStakeAmount() external view returns (uint256 minimum) {
        return minimumStakeAmount;
    }

    /**
     * @dev Get staking duration for a user
     * @param user Address to check
     * @return duration Time in seconds since staking started
     */
    function getStakingDuration(address user) external view returns (uint256 duration) {
        if (stakingTimestamp[user] == 0) {
            return 0;
        }
        return block.timestamp - stakingTimestamp[user];
    }

    /**
     * @dev Check if user has any staked tokens
     * @param user Address to check
     * @return hasStake True if user has tokens staked
     */
    function hasStakedTokens(address user) external view returns (bool hasStake) {
        return stakedBalances[user] > 0;
    }

    /**
     * @dev Calculate APY for a given amount and duration
     * @param amount Amount to calculate APY for
     * @param duration Duration in seconds
     * @return apy Calculated APY percentage (scaled by 100, e.g., 500 = 5.00%)
     */
    function calculateApy(uint256 amount, uint256 duration) external view returns (uint256 apy) {
        if (amount == 0 || duration == 0) {
            return 0;
        }

        return stakingRewardRate;
    }
}
