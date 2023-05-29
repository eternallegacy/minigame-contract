import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {expect} from "chai";
import hre, {upgrades} from "hardhat";
import {ethers} from "ethers";
import {bigint} from "hardhat/internal/core/params/argumentTypes";

describe("NftContract", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployNftFixture() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Token = await hre.ethers.getContractFactory("Token");
        const USDT = await Token.deploy("USDT", "USDT");

        const Nft1155ContractImpl = await hre.ethers.getContractFactory("Nft1155Contract");
        const data = Nft1155ContractImpl.interface.encodeFunctionData("initialize", ["test"]);
        // const nft1155ContractImpl = await Nft1155ContractImpl.deploy();

        // const TransparentUpgradeableProxy = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
        // var nft1155ContractProxy = await TransparentUpgradeableProxy.deploy(await nft1155ContractImpl.getAddress(),
        //     owner, data);

        const nft1155ContractProxy = await upgrades.deployProxy(Nft1155ContractImpl, ["test"],{ initializer: 'initialize' });

        const nft1155Contract = await await hre.ethers.getContractAt("Nft1155Contract", await nft1155ContractProxy.getAddress());

        const NftManagerWrapperImpl = await hre.ethers.getContractFactory("NftManagerWrapper");
        // const data2 = NftManagerWrapperImpl.interface.encodeFunctionData("initialize", []);
        // const nftManagerWrapperImpl = await NftManagerWrapperImpl.deploy();

        // const TransparentUpgradeableProxy2 = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
        // const nftManagerWrapperProxy = await TransparentUpgradeableProxy2.deploy(await nftManagerWrapperImpl.getAddress(),
        //     owner, data2);

        const nftManagerWrapperProxy = await upgrades.deployProxy(NftManagerWrapperImpl,{ initializer: 'initialize' });

        const nftManagerWrapper = await await hre.ethers.getContractAt("NftManagerWrapper", await nftManagerWrapperProxy.getAddress());
        await nft1155Contract.setMinter(await nftManagerWrapper.getAddress());
        await nftManagerWrapper.setNft(await nft1155Contract.getAddress());
        return {nft1155Contract, nftManagerWrapper, owner, otherAccount, USDT};
    }

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            const {nft1155Contract, nftManagerWrapper, owner, otherAccount} = await loadFixture(deployNftFixture);
            expect(await nft1155Contract.owner()).to.equal(owner.address);
            expect(await nft1155Contract.minter()).to.equal(await nftManagerWrapper.getAddress());
        });

        it("Should receive and store the funds to lock", async function () {
            const {nft1155Contract, nftManagerWrapper, owner, otherAccount, USDT} = await loadFixture(deployNftFixture);
            await nftManagerWrapper.setPrice("1",await USDT.getAddress(), ethers.parseEther("1"));
            expect(await nftManagerWrapper.prices("1",await USDT.getAddress())).to.equal(await ethers.parseEther("1"));
            await USDT.mint(ethers.parseEther("100000"));
            await USDT.approve(await nftManagerWrapper.getAddress(), ethers.parseEther("100000"));
            await nft1155Contract.setApprovalForAll(await nftManagerWrapper.getAddress(), true);
            //buy(uint256 id, uint256 value, bytes memory data, address under)
            let res = await nftManagerWrapper.buy('1', '10', '0x', await USDT.getAddress());
            console.log(res)
            let p = ethers.getDefaultProvider();
            let receipt = await p.getTransactionReceipt(res.hash)
            console.log(receipt)
            expect(await USDT.balanceOf(await nftManagerWrapper.getAddress())).to.equal(ethers.parseEther("10"));
        });

    });
});
