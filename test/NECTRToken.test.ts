import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { NECTRToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("NECTRToken", function () {
    let nectrToken: NECTRToken;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;
    let addrs: HardhatEthersSigner[];

    const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1M tokens
    const STAKE_AMOUNT = ethers.parseEther("100");
    const MIN_STAKE = ethers.parseEther("10");

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        const NECTRTokenFactory = await ethers.getContractFactory("NECTRToken");
        nectrToken = await NECTRTokenFactory.deploy();
        await nectrToken.waitForDeployment();

        // Transfer some tokens to test accounts
        await nectrToken.transfer(addr1.address, ethers.parseEther("1000"));
        await nectrToken.transfer(addr2.address, ethers.parseEther("1000"));
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await nectrToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await nectrToken.balanceOf(owner.address);
            expect(await nectrToken.totalSupply()).to.be.closeTo(
                ownerBalance + ethers.parseEther("2000"), // Account for transferred tokens
                ethers.parseEther("1")
            );
        });

        it("Should have correct name and symbol", async function () {
            expect(await nectrToken.name()).to.equal("NECTR Token");
            expect(await nectrToken.symbol()).to.equal("NECTR");
        });

        it("Should have correct decimals", async function () {
            expect(await nectrToken.decimals()).to.equal(18);
        });

        it("Should have correct initial staking parameters", async function () {
            expect(await nectrToken.stakingRewardRate()).to.equal(500); // 5%
            expect(await nectrToken.minimumStakeAmount()).to.equal(MIN_STAKE);
            expect(await nectrToken.totalStaked()).to.equal(0);
        });
    });

    describe("ERC20 Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const transferAmount = ethers.parseEther("50");

            await nectrToken.connect(addr1).transfer(addr2.address, transferAmount);

            expect(await nectrToken.balanceOf(addr1.address)).to.equal(
                ethers.parseEther("950")
            );
            expect(await nectrToken.balanceOf(addr2.address)).to.equal(
                ethers.parseEther("1050")
            );
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const transferAmount = ethers.parseEther("2000");

            await expect(
                nectrToken.connect(addr1).transfer(addr2.address, transferAmount)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("Should update allowances on approve", async function () {
            const approveAmount = ethers.parseEther("100");

            await nectrToken.connect(addr1).approve(addr2.address, approveAmount);

            expect(await nectrToken.allowance(addr1.address, addr2.address)).to.equal(
                approveAmount
            );
        });
    });

    describe("Staking Functionality", function () {
        it("Should allow users to stake tokens", async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);
            expect(await nectrToken.totalStaked()).to.equal(STAKE_AMOUNT);
            expect(await nectrToken.balanceOf(addr1.address)).to.equal(
                ethers.parseEther("900")
            );
            expect(await nectrToken.stakingTimestamp(addr1.address)).to.be.gt(0);
        });

        it("Should emit Staked event", async function () {
            await expect(nectrToken.connect(addr1).stake(STAKE_AMOUNT))
                .to.emit(nectrToken, "Staked")
                .withArgs(addr1.address, STAKE_AMOUNT, await time.latest() + 1);
        });

        it("Should not allow staking 0 tokens", async function () {
            await expect(
                nectrToken.connect(addr1).stake(0)
            ).to.be.revertedWith("Cannot stake 0 tokens");
        });

        it("Should not allow staking below minimum amount", async function () {
            const belowMin = ethers.parseEther("5");

            await expect(
                nectrToken.connect(addr1).stake(belowMin)
            ).to.be.revertedWith("Amount below minimum stake");
        });

        it("Should not allow staking more than balance", async function () {
            const tooMuch = ethers.parseEther("2000");

            await expect(
                nectrToken.connect(addr1).stake(tooMuch)
            ).to.be.revertedWith("Insufficient balance");
        });

        it("Should allow multiple stakes from same user", async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(
                STAKE_AMOUNT * 2n
            );
            expect(await nectrToken.totalStaked()).to.equal(STAKE_AMOUNT * 2n);
        });
    });

    describe("Unstaking Functionality", function () {
        beforeEach(async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
        });

        it("Should allow users to unstake tokens", async function () {
            // Fast forward time to accumulate some rewards
            await time.increase(30 * 24 * 60 * 60); // 30 days

            const balanceBefore = await nectrToken.balanceOf(addr1.address);

            await nectrToken.connect(addr1).unstake(STAKE_AMOUNT);

            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(0);
            expect(await nectrToken.totalStaked()).to.equal(0);

            // Should have original balance plus rewards
            const balanceAfter = await nectrToken.balanceOf(addr1.address);
            expect(balanceAfter).to.be.gt(balanceBefore + STAKE_AMOUNT);
        });

        it("Should emit Unstaked event with rewards", async function () {
            await time.increase(365 * 24 * 60 * 60); // 1 year

            await expect(nectrToken.connect(addr1).unstake(STAKE_AMOUNT))
                .to.emit(nectrToken, "Unstaked");
        });

        it("Should not allow unstaking 0 tokens", async function () {
            await expect(
                nectrToken.connect(addr1).unstake(0)
            ).to.be.revertedWith("Cannot unstake 0 tokens");
        });

        it("Should not allow unstaking more than staked", async function () {
            const tooMuch = ethers.parseEther("200");

            await expect(
                nectrToken.connect(addr1).unstake(tooMuch)
            ).to.be.revertedWith("Insufficient staked balance");
        });

        it("Should allow partial unstaking", async function () {
            const partialAmount = ethers.parseEther("50");

            await nectrToken.connect(addr1).unstake(partialAmount);

            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(
                STAKE_AMOUNT - partialAmount
            );
        });
    });

    describe("Rewards System", function () {
        beforeEach(async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
        });

        it("Should calculate rewards correctly after 1 year", async function () {
            // Fast forward 1 year
            await time.increase(365 * 24 * 60 * 60);

            const pendingRewards = await nectrToken.getPendingRewards(addr1.address);
            const expectedRewards = (STAKE_AMOUNT * 500n) / 10000n; // 5% of stake

            // Allow for small rounding differences (within 1%)
            const tolerance = expectedRewards / 100n;
            expect(pendingRewards).to.be.closeTo(expectedRewards, tolerance);
        });

        it("Should allow claiming rewards without unstaking", async function () {
            // Fast forward to accumulate rewards
            await time.increase(180 * 24 * 60 * 60); // 6 months

            const balanceBefore = await nectrToken.balanceOf(addr1.address);
            const pendingRewards = await nectrToken.getPendingRewards(addr1.address);

            await nectrToken.connect(addr1).claimRewards();

            // Should still be staked
            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);

            // Should have received rewards
            const balanceAfter = await nectrToken.balanceOf(addr1.address);
            expect(balanceAfter).to.equal(balanceBefore + pendingRewards);
        });

        it("Should emit RewardsClaimed event", async function () {
            await time.increase(30 * 24 * 60 * 60); // 30 days

            await expect(nectrToken.connect(addr1).claimRewards())
                .to.emit(nectrToken, "RewardsClaimed");
        });

        it("Should not allow claiming rewards with no stake", async function () {
            await expect(
                nectrToken.connect(addr2).claimRewards()
            ).to.be.revertedWith("No tokens staked");
        });

        it("Should reset rewards after claiming", async function () {
            await time.increase(30 * 24 * 60 * 60);

            await nectrToken.connect(addr1).claimRewards();

            // Pending rewards should be 0 immediately after claiming
            const pendingAfterClaim = await nectrToken.getPendingRewards(addr1.address);
            expect(pendingAfterClaim).to.equal(0);
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
            await time.increase(30 * 24 * 60 * 60); // 30 days
        });

        it("Should return correct staking info", async function () {
            const [stakedAmount, pendingRewards, stakingSince] =
                await nectrToken.getStakingInfo(addr1.address);

            expect(stakedAmount).to.equal(STAKE_AMOUNT);
            expect(pendingRewards).to.be.gt(0);
            expect(stakingSince).to.be.gt(0);
        });

        it("Should return correct contract stats", async function () {
            const [totalSupply_, totalStaked_, stakingRewardRate_, minimumStakeAmount_] =
                await nectrToken.getContractStats();

            expect(totalSupply_).to.be.gt(INITIAL_SUPPLY); // May have rewards minted
            expect(totalStaked_).to.equal(STAKE_AMOUNT);
            expect(stakingRewardRate_).to.equal(500);
            expect(minimumStakeAmount_).to.equal(MIN_STAKE);
        });
    });

    describe("Owner Functions", function () {
        it("Should allow owner to change reward rate", async function () {
            const newRate = 1000; // 10%

            await nectrToken.setStakingRewardRate(newRate);
            expect(await nectrToken.stakingRewardRate()).to.equal(newRate);
        });

        it("Should emit event when reward rate changes", async function () {
            const newRate = 750;

            await expect(nectrToken.setStakingRewardRate(newRate))
                .to.emit(nectrToken, "StakingRewardRateUpdated")
                .withArgs(500, newRate);
        });

        it("Should not allow non-owner to change reward rate", async function () {
            await expect(
                nectrToken.connect(addr1).setStakingRewardRate(1000)
            ).to.be.revertedWithCustomError(nectrToken, "OwnableUnauthorizedAccount")
                .withArgs(addr1.address);
        });

        it("Should not allow reward rate above 20%", async function () {
            await expect(
                nectrToken.setStakingRewardRate(2500) // 25%
            ).to.be.revertedWith("Rate cannot exceed 20%");
        });

        it("Should allow owner to change minimum stake amount", async function () {
            const newMin = ethers.parseEther("20");

            await nectrToken.setMinimumStakeAmount(newMin);
            expect(await nectrToken.minimumStakeAmount()).to.equal(newMin);
        });

        it("Should not allow setting minimum stake to 0", async function () {
            await expect(
                nectrToken.setMinimumStakeAmount(0)
            ).to.be.revertedWith("Minimum must be greater than 0");
        });

        it("Should allow owner to pause contract", async function () {
            await nectrToken.pause();

            await expect(
                nectrToken.connect(addr1).stake(STAKE_AMOUNT)
            ).to.be.revertedWithCustomError(nectrToken, "EnforcedPause");
        });

        it("Should allow owner to unpause contract", async function () {
            await nectrToken.pause();
            await nectrToken.unpause();

            // Should work again
            await expect(nectrToken.connect(addr1).stake(STAKE_AMOUNT)).to.not.be.reverted;
        });

        it("Should allow emergency withdrawal when paused", async function () {
            // First stake some tokens so contract has balance
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

            await nectrToken.pause();

            const contractBalance = await nectrToken.balanceOf(await nectrToken.getAddress());
            const ownerBalanceBefore = await nectrToken.balanceOf(owner.address);

            await nectrToken.emergencyWithdraw(owner.address, contractBalance);

            const ownerBalanceAfter = await nectrToken.balanceOf(owner.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + contractBalance);
        });
    });

    describe("Edge Cases & Security", function () {
        it("Should handle zero address correctly in emergency withdraw", async function () {
            await nectrToken.pause();

            await expect(
                nectrToken.emergencyWithdraw(ethers.ZeroAddress, ethers.parseEther("100"))
            ).to.be.revertedWith("Invalid address");
        });

        it("Should prevent emergency withdraw when not paused", async function () {
            await expect(
                nectrToken.emergencyWithdraw(owner.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(nectrToken, "ExpectedPause");
        });

        it("Should handle multiple users staking simultaneously", async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
            await nectrToken.connect(addr2).stake(STAKE_AMOUNT);

            expect(await nectrToken.totalStaked()).to.equal(STAKE_AMOUNT * 2n);
            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);
            expect(await nectrToken.stakedBalances(addr2.address)).to.equal(STAKE_AMOUNT);
        });

        it("Should handle rewards calculation for very short periods", async function () {
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

            // Advance just 1 hour
            await time.increase(60 * 60);

            const pendingRewards = await nectrToken.getPendingRewards(addr1.address);
            expect(pendingRewards).to.be.gt(0);
        });

        it("Should handle complex staking scenarios", async function () {
            // User stakes, waits, stakes more, waits, unstakes partially
            await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
            await time.increase(30 * 24 * 60 * 60); // 30 days

            await nectrToken.connect(addr1).stake(STAKE_AMOUNT); // Stake more
            await time.increase(30 * 24 * 60 * 60); // Another 30 days

            const pendingBefore = await nectrToken.getPendingRewards(addr1.address);
            await nectrToken.connect(addr1).unstake(STAKE_AMOUNT); // Partial unstake

            // Should still have some tokens staked
            expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);
            expect(await nectrToken.getPendingRewards(addr1.address)).to.equal(0); // Rewards claimed
        });
    });
});
      ).to.be.revertedWith("Rate cannot exceed 20%");
    });

it("Should allow owner to change minimum stake amount", async function () {
    const newMin = ethers.parseEther("20");

    await nectrToken.setMinimumStakeAmount(newMin);
    expect(await nectrToken.minimumStakeAmount()).to.equal(newMin);
});

it("Should not allow setting minimum stake to 0", async function () {
    await expect(
        nectrToken.setMinimumStakeAmount(0)
    ).to.be.revertedWith("Minimum must be greater than 0");
});

it("Should allow owner to pause contract", async function () {
    await nectrToken.pause();

    await expect(
        nectrToken.connect(addr1).stake(STAKE_AMOUNT)
    ).to.be.revertedWithCustomError(nectrToken, "EnforcedPause");
});

it("Should allow owner to unpause contract", async function () {
    await nectrToken.pause();
    await nectrToken.unpause();

    // Should work again
    await expect(nectrToken.connect(addr1).stake(STAKE_AMOUNT)).to.not.be.reverted;
});

it("Should allow emergency withdrawal when paused", async function () {
    // First stake some tokens so contract has balance
    await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

    await nectrToken.pause();

    const contractBalance = await nectrToken.balanceOf(await nectrToken.getAddress());
    const ownerBalanceBefore = await nectrToken.balanceOf(owner.address);

    await nectrToken.emergencyWithdraw(owner.address, contractBalance);

    const ownerBalanceAfter = await nectrToken.balanceOf(owner.address);
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + contractBalance);
});
  });

describe("Edge Cases & Security", function () {
    it("Should handle zero address correctly in emergency withdraw", async function () {
        await nectrToken.pause();

        await expect(
            nectrToken.emergencyWithdraw(ethers.ZeroAddress, ethers.parseEther("100"))
        ).to.be.revertedWith("Invalid address");
    });

    it("Should prevent emergency withdraw when not paused", async function () {
        await expect(
            nectrToken.emergencyWithdraw(owner.address, ethers.parseEther("100"))
        ).to.be.revertedWithCustomError(nectrToken, "ExpectedPause");
    });

    it("Should handle multiple users staking simultaneously", async function () {
        await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
        await nectrToken.connect(addr2).stake(STAKE_AMOUNT);

        expect(await nectrToken.totalStaked()).to.equal(STAKE_AMOUNT * 2n);
        expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);
        expect(await nectrToken.stakedBalances(addr2.address)).to.equal(STAKE_AMOUNT);
    });

    it("Should handle rewards calculation for very short periods", async function () {
        await nectrToken.connect(addr1).stake(STAKE_AMOUNT);

        // Advance just 1 hour
        await time.increase(60 * 60);

        const pendingRewards = await nectrToken.getPendingRewards(addr1.address);
        expect(pendingRewards).to.be.gt(0);
    });

    it("Should handle complex staking scenarios", async function () {
        // User stakes, waits, stakes more, waits, unstakes partially
        await nectrToken.connect(addr1).stake(STAKE_AMOUNT);
        await time.increase(30 * 24 * 60 * 60); // 30 days

        await nectrToken.connect(addr1).stake(STAKE_AMOUNT); // Stake more
        await time.increase(30 * 24 * 60 * 60); // Another 30 days

        const pendingBefore = await nectrToken.getPendingRewards(addr1.address);
        await nectrToken.connect(addr1).unstake(STAKE_AMOUNT); // Partial unstake

        // Should still have some tokens staked
        expect(await nectrToken.stakedBalances(addr1.address)).to.equal(STAKE_AMOUNT);
        expect(await nectrToken.getPendingRewards(addr1.address)).to.equal(0); // Rewards claimed
    });
});
});