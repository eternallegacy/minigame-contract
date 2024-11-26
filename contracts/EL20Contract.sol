// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EL20Contract is ERC20, Ownable, ERC20Permit {
    address public minter;
    constructor()
        ERC20("Eternal Legacy EXP", "EXP")
        Ownable(msg.sender)
        ERC20Permit("Eternal Legacy EXP")
    {}

    event SetMinter(address oldMinter, address newMinter);
    modifier onlyMinter() {
        require(msg.sender == minter, "only minter");
        _;
    }

    function setMinter(address _minter) public onlyOwner {
        address oldMinter = minter;
        minter = _minter;
        emit SetMinter(oldMinter, _minter);
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public {
        _burn(to, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    // 转账方法： transfer2
    function transfer2(
        address to,
        uint256 amount,
        uint8 decimal
    ) public returns (bool) {
        uint8 _decimal = decimals();
         
        require(decimal <= _decimal);

        // 计算 amount2
        uint256 amount2 = (amount / (10 ** (_decimal - decimal))) *
            (10 ** (_decimal - decimal));

        // 检查 amount2 是否大于零，然后执行转账
        if (amount2 > 0) {
            _transfer(msg.sender, to, amount2);
            return true;
        }

        return false; // 如果 amount2 没有大于零，返回 false
    }
}
