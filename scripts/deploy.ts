import hre, {upgrades} from "hardhat";
import {ethers} from "ethers";
import {expect} from "chai";

//USDT 0xd7dE3D8a15276DBFc1cB09FcDc91040Bd08632Df
// nft1155ContractProxy 0xa6d215E8411A0ff776243F77a66fE5502251C0B4
// nftManagerWrapperProxy 0x5C1055015d4d919AcE9A5df57f9a018664F50A58
//npx hardhat run ./scripts/deploy.ts --network sepolia
async function main() {



    if(true){
        const USDT = await await hre.ethers.getContractAt("Token", "0xd7dE3D8a15276DBFc1cB09FcDc91040Bd08632Df");
        const nft1155Contract = await await hre.ethers.getContractAt("Nft1155Contract", "0xa6d215E8411A0ff776243F77a66fE5502251C0B4");
        const nftManagerWrapper = await await hre.ethers.getContractAt("NftManagerWrapper", "0x5C1055015d4d919AcE9A5df57f9a018664F50A58");

        await nftManagerWrapper.setPrice("1",await USDT.getAddress(), ethers.parseEther("1"));
        console.log(await nftManagerWrapper.prices("1",await USDT.getAddress()));
        await USDT.mint(ethers.parseEther("100000"));
        await USDT.approve(await nftManagerWrapper.getAddress(), ethers.parseEther("100000"));
        await nft1155Contract.setApprovalForAll(await nftManagerWrapper.getAddress(), true);
        let res = await nftManagerWrapper.buy('1', '10', '0x', await USDT.getAddress());
        console.log(res)
        return;
    }
    const Token = await hre.ethers.getContractFactory("Token");
    const USDT = await Token.deploy("USDT", "USDT");

    console.log("USDT",await USDT.getAddress());

    const Nft1155ContractImpl = await hre.ethers.getContractFactory("Nft1155Contract");
    const nft1155ContractProxy = await upgrades.deployProxy(Nft1155ContractImpl, ["test"],{ initializer: 'initialize' });
    console.log("nft1155ContractProxy",await nft1155ContractProxy.getAddress());
    const nft1155Contract = await await hre.ethers.getContractAt("Nft1155Contract", await nft1155ContractProxy.getAddress());

    const NftManagerWrapperImpl = await hre.ethers.getContractFactory("NftManagerWrapper");
    const nftManagerWrapperProxy = await upgrades.deployProxy(NftManagerWrapperImpl,{ initializer: 'initialize' });
    console.log("nftManagerWrapperProxy",await nftManagerWrapperProxy.getAddress());

    const nftManagerWrapper = await await hre.ethers.getContractAt("NftManagerWrapper", await nftManagerWrapperProxy.getAddress());
    await nft1155Contract.setMinter(await nftManagerWrapper.getAddress());
    await nftManagerWrapper.setNft(await nft1155Contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});