// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {NECTRToken} from "../src/NECTRToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey;
        
        if (bytes(privateKeyStr).length >= 2 && 
            bytes(privateKeyStr)[0] == "0" && 
            bytes(privateKeyStr)[1] == "x") {
            deployerPrivateKey = vm.parseUint(privateKeyStr);
        } else {
            deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyStr)));
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying NECTRToken...");
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        
        NECTRToken nectrToken = new NECTRToken();
        
        console.log("NECTRToken deployed to:", address(nectrToken));
        console.log("Deployer:", nectrToken.owner());
        console.log("Total Supply:", nectrToken.totalSupply());
        console.log("Token Name:", nectrToken.name());
        console.log("Token Symbol:", nectrToken.symbol());
        
        (uint256 totalSupply_, uint256 totalStaked_, uint256 stakingRewardRate_, uint256 minimumStakeAmount_) = 
            nectrToken.getContractStats();
            
        console.log("Initial Stats:");
        console.log("- Total Supply:", totalSupply_);
        console.log("- Total Staked:", totalStaked_);
        console.log("- Staking Reward Rate:", stakingRewardRate_, "basis points");
        console.log("- Minimum Stake Amount:", minimumStakeAmount_);
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("Contract Address:", address(nectrToken));
        console.log("Network: Polygon Amoy Testnet");
        console.log("Block Explorer: https://amoy.polygonscan.com/address/%s", address(nectrToken));
    }
}