// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";


interface INft1155Contract {
    function mint(address to, uint256 id, uint256 value, bytes memory data) external;

    function burn(uint256 id, uint256 value) external;
}

contract Nft1155Contract is ERC1155Upgradeable, OwnableUpgradeable, INft1155Contract {

    address public minter;


    event SetMinter(address oldMinter, address newMinter);

    modifier onlyMinter() {
        require(msg.sender == minter, "only minter");
        _;
    }

    function initialize(string memory uri_) public initializer {
        __Ownable_init(msg.sender);
        __ERC1155_init(uri_);
    }


    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setMinter(address _minter) public onlyOwner {
        address oldMinter = minter;
        minter = _minter;
        emit SetMinter(oldMinter, _minter);
    }

    function burn(uint256 id, uint256 value) public {
        _burn(msg.sender, id, value);
    }

    function mint(address to, uint256 id, uint256 value, bytes memory data) public onlyMinter {
        _mint(to, id, value, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) public onlyMinter {
        _mintBatch(to, ids, values, data);
    }

}