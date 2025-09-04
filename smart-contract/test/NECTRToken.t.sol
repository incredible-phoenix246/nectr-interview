// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {NECTRToken} from "../src/NECTRToken.sol";

contract NECTRTokenTest is Test {
    NECTRToken public nectrToken;
    address public owner;
    address public user1;
    address public user2;
    
    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    uint256 constant STAKE_AMOUNT = 100 * 10**18;
    uint256 constant MIN_STAKE = 10 * 10**18;
    
    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        vm.prank(owner);
        nectrToken = new NECTRToken();
        
        vm.prank(owner);
        nectrToken.transfer(user1, 1000 * 10**18);
        
        vm.prank(owner);
        nectrToken.transfer(user2, 1000 * 10**18);
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
        nectrToken.stake(STAKE_AMOUNT);
        
        assertEq(nectrToken.stakedBalances(user1), STAKE_AMOUNT);
        assertEq(nectrToken.totalStaked(), STAKE_AMOUNT);
        assertEq(nectrToken.balanceOf(user1), 1000 * 10**18 - STAKE_AMOUNT);
    }
    
    function test_StakeFailsWithInsufficientAmount() public {
        vm.prank(user1);
        vm.expectRevert("Amount below minimum stake");
        nectrToken.stake(5 * 10**18); 
    }
    
    function test_StakeFailsWithInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        nectrToken.stake(2000 * 10**18); 
    }
    
    function test_Unstake() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);
        
        vm.warp(block.timestamp + 365 days);
        
        uint256 balanceBefore = nectrToken.balanceOf(user1);
        
        vm.prank(user1);
        nectrToken.unstake(STAKE_AMOUNT);
        
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
        nectrToken.claimRewards();
        
        assertEq(nectrToken.stakedBalances(user1), STAKE_AMOUNT);
        assertEq(nectrToken.balanceOf(user1), balanceBefore + pendingRewards);
    }
    
    function test_RewardCalculation() public {
        vm.prank(user1);
        nectrToken.stake(STAKE_AMOUNT);
        
        vm.warp(block.timestamp + 365 days);
        
        uint256 expectedRewards = (STAKE_AMOUNT * 500) / 10000;
        uint256 actualRewards = nectrToken.getPendingRewards(user1);
        
        assertApproxEqRel(actualRewards, expectedRewards, 0.01e18);
    }
    
    function test_OnlyOwnerCanSetRewardRate() public {
        vm.prank(user1);
        vm.expectRevert();
        nectrToken.setStakingRewardRate(1000);
        
        vm.prank(owner);
        nectrToken.setStakingRewardRate(1000);
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
        nectrToken.pause();
        
        vm.prank(user1);
        vm.expectRevert();
        nectrToken.stake(STAKE_AMOUNT);
    }
    
    function test_GetContractStats() public view {
        (uint256 totalSupply_, uint256 totalStaked_, uint256 stakingRewardRate_, uint256 minimumStakeAmount_) = 
            nectrToken.getContractStats();
        
        assertEq(totalSupply_, INITIAL_SUPPLY);
        assertEq(totalStaked_, 0);
        assertEq(stakingRewardRate_, 500);
        assertEq(minimumStakeAmount_, MIN_STAKE);
    }
    
    function testFuzz_Stake(uint256 amount) public {
        amount = bound(amount, MIN_STAKE, nectrToken.balanceOf(user1));
        
        vm.prank(user1);
        nectrToken.stake(amount);
        
        assertEq(nectrToken.stakedBalances(user1), amount);
    }
}