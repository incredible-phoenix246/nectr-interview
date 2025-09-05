// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {NECTRToken} from "../src/NECTRToken.sol";

contract TransferTokensScript is Script {
    function run() public {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyStr)));

        address contractAddress = 0xa2225d1825ec6E8Ba2AAAf9DF3106D0543ae7AA6;
        address recipient = vm.addr(deployerPrivateKey);
        uint256 amount = 10_000 * 10 ** 18;

        vm.startBroadcast(deployerPrivateKey);

        NECTRToken nectrToken = NECTRToken(contractAddress);
        require(nectrToken.transfer(recipient, amount), "Transfer failed");

        console.log("Transferred", amount, "tokens to", recipient);

        vm.stopBroadcast();
    }
}
