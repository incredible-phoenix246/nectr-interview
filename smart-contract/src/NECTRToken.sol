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
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    
    // Total staked tokens
    uint256 public totalStaked;
    
    // Minimum staking amount (10 NECTR)
    uint256 public minimumStakeAmount = 10 * 10**decimals();
    
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
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }
    
    /**
     * @dev Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
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
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
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
    }
    
    /**
     * @dev Claim accumulated rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        require(stakedBalances[msg.sender] > 0, "No tokens staked");
        
        _updateRewards(msg.sender);
        
        uint256 rewards = accumulatedRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");
        
        accumulatedRewards[msg.sender] = 0;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        // Mint rewards to user
        _mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Get pending rewards for a user
     * @param user Address to check rewards for
     * @return Pending rewards amount
     */
    function getPendingRewards(address user) external view returns (uint256) {
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
     */
    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 2000, "Rate cannot exceed 20%"); // Max 20% APY
        
        uint256 oldRate = stakingRewardRate;
        stakingRewardRate = newRate;
        
        emit StakingRewardRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Set minimum stake amount (only owner)
     * @param newMinimum New minimum stake amount
     */
    function setMinimumStakeAmount(uint256 newMinimum) external onlyOwner {
        require(newMinimum > 0, "Minimum must be greater than 0");
        
        uint256 oldAmount = minimumStakeAmount;
        minimumStakeAmount = newMinimum;
        
        emit MinimumStakeAmountUpdated(oldAmount, newMinimum);
    }
    
    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal function (only owner, when paused)
     * @param to Address to send tokens to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner whenPaused {
        require(to != address(0), "Invalid address");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");
        
        _transfer(address(this), to, amount);
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
}