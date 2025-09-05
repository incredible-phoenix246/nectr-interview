// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {NECTRToken} from "../src/NECTRToken.sol";

contract NECTRTokenTest is Test {
    NECTRToken public nectrToken;
    address public owner;
    address public user1;
    address public user2;

    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 constant STAKE_AMOUNT = 100 * 10 ** 18;
    uint256 constant MIN_STAKE = 10 * 10 ** 18;

    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.prank(owner);
        nectrToken = new NECTRToken();

        vm.prank(owner);
        require(nectrToken.transfer(user1, 1000 * 10 ** 18), "Transfer to user1 failed");

        vm.prank(owner);
        require(nectrToken.transfer(user2, 1000 * 10 ** 18), "Transfer to user2 failed");
    }

    function test_InitialState() public view {
        assertEq(nectrToken.name(), "NECTR Token");
        assertEq(nectrToken.symbol(), "NECTR");
        assertEq(nectrToken.totalSupply(), INITIAL_SUPPLY);
        assertEq(nectrToken.owner(), owner);
        assertEq(nectrToken.stakingRewardRate(), 500);
    }

    function test_Stake() public {
        vm.prank(user1);
        bool success = nectrToken.stake(STAKE_AMOUNT);

        assertTrue(success);
        assertEq(nectrToken.stakedBalances(user1), STAKE_AMOUNT);
        assertEq(nectrToken.totalStaked(), STAKE_AMOUNT);
        assertEq(nectrToken.balanceOf(user1), 1000 * 10 ** 18 - STAKE_AMOUNT);
    }

    function test_StakeFailsWithInsufficientAmount() public {
        vm.prank(user1);
        vm.expectRevert("Amount below minimum stake");
        nectrToken.stake(5 * 10 ** 18);
    }

    function test_StakeFailsWithInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        nectrToken.stake(2000 * 10 ** 18);
    }

    function test_Unstake() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 365 days);

        uint256 balanceBefore = nectrToken.balanceOf(user1);

        vm.prank(user1);
        (bool success, uint256 rewardsClaimed) = nectrToken.unstake(STAKE_AMOUNT);

        assertTrue(success);
        assertGt(rewardsClaimed, 0);
        assertEq(nectrToken.stakedBalances(user1), 0);
        assertEq(nectrToken.totalStaked(), 0);
        assertGt(nectrToken.balanceOf(user1), balanceBefore + STAKE_AMOUNT);
    }

    function test_ClaimRewards() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 365 days);

        uint256 balanceBefore = nectrToken.balanceOf(user1);
        uint256 pendingRewards = nectrToken.getPendingRewards(user1);

        vm.prank(user1);
        (bool success, uint256 rewardsClaimed) = nectrToken.claimRewards();

        assertTrue(success);
        assertEq(rewardsClaimed, pendingRewards);
        assertEq(nectrToken.stakedBalances(user1), STAKE_AMOUNT);
        assertEq(nectrToken.balanceOf(user1), balanceBefore + pendingRewards);
    }

    function test_RewardCalculation() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 365 days);

        uint256 expectedRewards = (STAKE_AMOUNT * 500) / 10_000;
        uint256 actualRewards = nectrToken.getPendingRewards(user1);

        assertApproxEqRel(actualRewards, expectedRewards, 0.01e18);
    }

    function test_OnlyOwnerCanSetRewardRate() public {
        vm.prank(user1);
        vm.expectRevert();
        nectrToken.setStakingRewardRate(1000);

        vm.prank(owner);
        bool success = nectrToken.setStakingRewardRate(1000);
        assertTrue(success);
        assertEq(nectrToken.stakingRewardRate(), 1000);
    }

    function test_CannotSetRewardRateTooHigh() public {
        vm.prank(owner);
        vm.expectRevert("Rate cannot exceed 20%");
        nectrToken.setStakingRewardRate(2500);
    }

    function test_GetStakingInfo() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 100 days);

        (uint256 stakedAmount, uint256 pendingRewards, uint256 stakingSince) =
            nectrToken.getStakingInfo(user1);

        assertEq(stakedAmount, STAKE_AMOUNT);
        assertGt(pendingRewards, 0);
        assertGt(stakingSince, 0);
    }

    function test_Pause() public {
        vm.prank(owner);
        bool success = nectrToken.pause();
        assertTrue(success);

        vm.prank(user1);
        vm.expectRevert();
        nectrToken.stake(STAKE_AMOUNT);
    }

    function test_Unpause() public {
        vm.prank(owner);
        nectrToken.pause();

        vm.prank(owner);
        bool success = nectrToken.unpause();
        assertTrue(success);

        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);
        assertEq(nectrToken.stakedBalances(user1), STAKE_AMOUNT);
    }

    function test_GetContractStats() public view {
        (
            uint256 totalSupply_,
            uint256 totalStaked_,
            uint256 stakingRewardRate_,
            uint256 minimumStakeAmount_
        ) = nectrToken.getContractStats();

        assertEq(totalSupply_, INITIAL_SUPPLY);
        assertEq(totalStaked_, 0);
        assertEq(stakingRewardRate_, 500);
        assertEq(minimumStakeAmount_, MIN_STAKE);
    }

    // Test new getter functions with return types
    function test_GetStakedBalance() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        uint256 balance = nectrToken.getStakedBalance(user1);
        assertEq(balance, STAKE_AMOUNT);
        
        uint256 zeroBalance = nectrToken.getStakedBalance(user2);
        assertEq(zeroBalance, 0);
    }

    function test_GetStakingTimestamp() public {
        uint256 timestampBefore = block.timestamp;
        
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        uint256 timestamp = nectrToken.getStakingTimestamp(user1);
        assertGe(timestamp, timestampBefore);
        
        uint256 zeroTimestamp = nectrToken.getStakingTimestamp(user2);
        assertEq(zeroTimestamp, 0);
    }

    function test_GetAccumulatedRewards() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 100 days);

        uint256 rewards = nectrToken.getAccumulatedRewards(user1);
        assertEq(rewards, 0); // Should be 0 until rewards are updated

        // Trigger reward update by calling getPendingRewards
        nectrToken.getPendingRewards(user1);
        
        uint256 zeroRewards = nectrToken.getAccumulatedRewards(user2);
        assertEq(zeroRewards, 0);
    }

    function test_GetStakingRewardRate() public {
        uint256 rate = nectrToken.getStakingRewardRate();
        assertEq(rate, 500);

        vm.prank(owner);
        nectrToken.setStakingRewardRate(1000);

        uint256 newRate = nectrToken.getStakingRewardRate();
        assertEq(newRate, 1000);
    }

    function test_GetTotalStaked() public {
        uint256 totalStaked = nectrToken.getTotalStaked();
        assertEq(totalStaked, 0);

        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        totalStaked = nectrToken.getTotalStaked();
        assertEq(totalStaked, STAKE_AMOUNT);

        vm.prank(user2);
        nectrToken.stake(STAKE_AMOUNT);

        totalStaked = nectrToken.getTotalStaked();
        assertEq(totalStaked, STAKE_AMOUNT * 2);
    }

    function test_GetMinimumStakeAmount() public {
        uint256 minimum = nectrToken.getMinimumStakeAmount();
        assertEq(minimum, MIN_STAKE);

        vm.prank(owner);
        nectrToken.setMinimumStakeAmount(20 * 10 ** 18);

        uint256 newMinimum = nectrToken.getMinimumStakeAmount();
        assertEq(newMinimum, 20 * 10 ** 18);
    }

    function test_GetStakingDuration() public {
        uint256 duration = nectrToken.getStakingDuration(user1);
        assertEq(duration, 0);

        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.warp(block.timestamp + 100 days);

        duration = nectrToken.getStakingDuration(user1);
        assertEq(duration, 100 days);
    }

    function test_HasStakedTokens() public {
        bool hasStake = nectrToken.hasStakedTokens(user1);
        assertFalse(hasStake);

        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        hasStake = nectrToken.hasStakedTokens(user1);
        assertTrue(hasStake);

        vm.prank(user1);
        nectrToken.unstake(STAKE_AMOUNT);

        hasStake = nectrToken.hasStakedTokens(user1);
        assertFalse(hasStake);
    }

    function test_CalculateAPY() public view {
        uint256 apy = nectrToken.calculateApy(0, 365 days);
        assertEq(apy, 0);

        apy = nectrToken.calculateApy(STAKE_AMOUNT, 0);
        assertEq(apy, 0);

        apy = nectrToken.calculateApy(STAKE_AMOUNT, 365 days);
        assertEq(apy, 500); // Should equal the reward rate

        // Test different duration
        apy = nectrToken.calculateApy(STAKE_AMOUNT, 182 days); // Half year
        assertEq(apy, 500); // APY should remain the same regardless of duration
    }

    function test_SetMinimumStakeAmount() public {
        vm.prank(owner);
        bool success = nectrToken.setMinimumStakeAmount(50 * 10 ** 18);
        assertTrue(success);
        assertEq(nectrToken.getMinimumStakeAmount(), 50 * 10 ** 18);

        vm.prank(user1);
        vm.expectRevert();
        nectrToken.setMinimumStakeAmount(100 * 10 ** 18);
    }

    function test_EmergencyWithdraw() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);

        vm.prank(owner);
        nectrToken.pause();

        uint256 contractBalance = nectrToken.balanceOf(address(nectrToken));

        vm.prank(owner);
        bool success = nectrToken.emergencyWithdraw(owner, contractBalance);
        assertTrue(success);

        assertEq(nectrToken.balanceOf(address(nectrToken)), 0);
        assertEq(nectrToken.balanceOf(owner), INITIAL_SUPPLY - 2000 * 10 ** 18 + contractBalance);
    }

    function testFuzz_Stake(uint256 amount) public {
        amount = bound(amount, MIN_STAKE, nectrToken.balanceOf(user1));

        vm.prank(user1);
        bool success = nectrToken.stake(amount);

        assertTrue(success);
        assertEq(nectrToken.stakedBalances(user1), amount);
    }

    function testFuzz_GetStakedBalance(address user) public view {
        vm.assume(user != address(0));
        uint256 balance = nectrToken.getStakedBalance(user);
        assertEq(balance, nectrToken.stakedBalances(user));
    }

    function testFuzz_CalculateAPY(uint256 amount, uint256 duration) public view {
        amount = bound(amount, 1, type(uint128).max);
        duration = bound(duration, 1, 10 * 365 days);

        uint256 apy = nectrToken.calculateApy(amount, duration);
        assertEq(apy, nectrToken.stakingRewardRate());
    }
}