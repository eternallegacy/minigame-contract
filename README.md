# Easy contract package for Mini Games

Uses `hardhat` toolchain for EVM.

## NftManagerWrapper

- `setNft(IERC1155 _nft)`
  - set ERC1155 contract (`_nft`) to manage
- `setPrice(uint256 id, address underlying, uint256 price)`
  - set `price` for certain ERC1155 token (`id`), based on `underlying` ERC20 token (0 for native token)
- `buy(uint256 id, uint256 value, bytes memory data, address underlying)`
  - buy amount (`value`) of certain ERC1155 token (`id`) with extra in-game order info (`data`), with specified (`underlying`) ERC20 token. This function will,
    1. [Web3 asset action] mint token to end user
    2. [Web3 game action] transfer token back to manager, on behalf of end user, be sure that the end users shall auth their ERC1155 token to this contract
    3. [Web3 game action] burn the token and notify game for order completion

## LogContract

- `log(string calldata data)`
  - log data on chain and notify mini game server