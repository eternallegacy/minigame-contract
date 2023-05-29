// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory name_, string memory symbol_)ERC20(name_, symbol_) {
    }

    function mint(uint256 value) public {
        _mint(msg.sender, value);
    }
}