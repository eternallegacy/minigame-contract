// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "./Nft1155Contract.sol";

contract NftManagerWrapper is ERC1155Upgradeable, OwnableUpgradeable, IERC1155Receiver {
    using SafeERC20 for IERC20;
    IERC1155 public nft;
    mapping(uint256 => mapping(address => uint256)) public prices;//id=>underlying=>price

    event SetPrice(uint256 id, address underlying, uint256 price);
    event SetNft(address oldNft, address newNft);
    event Buy(address indexed user, uint256 id, uint256 value, bytes data, address indexed underlying, address indexed nft);

    function initialize() public initializer {
        __Ownable_init(msg.sender);
    }

    function setPrice(uint256 id, address underlying, uint256 price) public onlyOwner {
        prices[id][underlying] = price;
        emit SetPrice(id, underlying, price);
    }

    function setNft(IERC1155 _nft) public onlyOwner {
        address oldNft = address(nft);
        nft = _nft;
        emit SetNft(oldNft, address(_nft));
    }

    function buy(uint256 id, uint256 value, bytes memory data, address underlying) payable public {
        uint256 price = prices[id][underlying];
        require(price > 0, "invalid under");
        if (isNativeToken(underlying)) {
            require(msg.value >= price * value);
        } else {
            IERC20(underlying).safeTransferFrom(msg.sender, address(this), price * value);
        }
        INft1155Contract(address(nft)).mint(msg.sender, id, value, data);
        nft.safeTransferFrom(msg.sender, address(this), id, value, data);
        INft1155Contract(address(nft)).burn(id, value);
        emit Buy(msg.sender, id, value, data, underlying, address(nft));
    }

    function withdraw(address underlying, uint256 amount) public onlyOwner {
        if (isNativeToken(underlying)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(underlying).safeTransfer(owner(), amount);
        }
    }

    function isNativeToken(address under) internal pure returns (bool) {
        if (under == address(0)) {
            return true;
        } else {
            return false;
        }
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) public returns (bytes4){
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) public returns (bytes4){
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }
}
