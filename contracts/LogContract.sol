
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;


contract LogContract {

    event Log(address user, uint256 date, string data);

    function log(string calldata data) public {
        emit Log(msg.sender, block.timestamp, data);
    }
}