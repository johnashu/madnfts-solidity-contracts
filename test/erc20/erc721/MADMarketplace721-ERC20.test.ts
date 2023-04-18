import "@nomicfoundation/hardhat-chai-matchers";
// import "hardhat-tracer";
import {
  loadFixture,
  mine,
} from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractReceipt, Wallet } from "ethers";
import {
  ethers,
  network, // tracer
} from "hardhat";

import {
  MADFactory721,
  MADMarketplace721,
  MADRouter721,
  MockERC20,
} from "../../../src/types";
import { MarketplaceErrors } from "./../../utils/errors";
import {
  dead,
  getOrderId721,
  madFixture721D,
} from "./../../utils/madFixtures";

describe("MADMarketplace721 - ERC20 Payments", () => {
  type WalletWithAddress = Wallet & SignerWithAddress;

  // contract deployer/admin
  let owner: WalletWithAddress;

  // ambassador
  let amb: WalletWithAddress;

  // marketplace address
  // let mad: WalletWithAddress;

  // extra EOAs
  let acc01: WalletWithAddress;
  let acc02: WalletWithAddress;

  let f721: MADFactory721;
  let m721: MADMarketplace721;
  let r721: MADRouter721;
  let erc20: MockERC20;

  const price: BigNumber = ethers.utils.parseEther("1");
  const erc20Balance: BigNumber =
    ethers.utils.parseEther("500");

  before("Set signers and reset network", async () => {
    [owner, amb, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ f721, m721, r721, erc20 } = await loadFixture(
      madFixture721D,
    ));
    await r721.deployed();
    await m721.deployed();
    await f721.deployed();
    await erc20.transfer(acc01.address, erc20Balance);
    await erc20.transfer(acc02.address, erc20Balance);
  });

  describe("Init", async () => {
    it("Marketplace should initialize with ERC20 payment token", async () => {
      expect(m721).to.be.ok;
      expect(await m721.callStatic.name()).to.eq("market");
      expect(await m721.erc20()).to.eq(erc20.address);
      expect(await m721.recipient()).to.eq(owner.address);
      expect(await m721.minOrderDuration()).to.eq(300);
      expect(await m721.minAuctionIncrement()).to.eq(300);
      expect(await m721.minBidValue()).to.eq(20);
      expect(await m721.MADFactory()).to.eq(f721.address);
      expect(await f721.callStatic.erc20()).to.eq(
        erc20.address,
      );
    });
  });

  describe("Buying", async () => {
    it("Should revert buy if buyer has insufficient ERC20 balance", async () => {
      // acc02 = seller
      // acc01 = buyer
      await m721.updateSettings(300, 10, 20, 31536000);
      await f721
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f721.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );

      // Mint and pay mint fees with ERC20, then approve nft for marketplace listing
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      expect(erc20MintTx).to.be.ok;
      const result = await r721
        .connect(acc02)
        .basicMintTo(basic.address, acc02.address, 1);
      expect(result).to.be.ok;
      const tx = await basic
        .connect(acc02)
        .approve(m721.address, 1);
      const blockTimestamp = (
        await m721.provider.getBlock(tx.blockNumber || 0)
      ).timestamp;

      // List for fixed price
      const fpTx = await m721
        .connect(acc02)
        .fixedPrice(
          basic.address,
          1,
          price,
          blockTimestamp + 301,
        );
      const fpRc: ContractReceipt = await fpTx.wait();
      const fpBn = fpRc.blockNumber;
      const fpOrderId = getOrderId721(
        fpBn,
        basic.address,
        1,
        acc02.address,
      );

      // Attempt to buy without acc01 approving erc20
      await expect(
        m721.connect(acc01).buy(fpOrderId),
      ).to.be.revertedWithCustomError(
        m721,
        MarketplaceErrors.WrongPrice,
      );
    });
    it("Should buy token with ERC20, distribute ERC20 splitter and fees", async () => {
      // acc02 = seller
      // acc01 = buyer

      const ownerERC20Bal = await erc20.balanceOf(
        await m721.callStatic.recipient(),
      );

      // Mint and list token
      await m721.updateSettings(300, 10, 20, 31536000);
      await f721
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f721.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "cid/id.json",
          splAddr,
          1000,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      const splitter = await ethers.getContractAt(
        "SplitterImpl",
        splAddr,
      );

      // Mint the token with erc20
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      expect(erc20MintTx).to.be.ok;
      await r721
        .connect(acc02)
        .basicMintTo(basic.address, acc02.address, 1);

      // acc02 = erc20Balance - 0.25
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance.sub(ethers.utils.parseEther("0.25")),
      );

      // Create marketplace order
      const tx = await basic
        .connect(acc02)
        .approve(m721.address, 1);
      const blockTimestamp = (
        await m721.provider.getBlock(tx.blockNumber || 0)
      ).timestamp;
      const fpTx = await m721
        .connect(acc02)
        .fixedPrice(
          basic.address,
          1,
          price,
          blockTimestamp + 301,
        );
      const fpRc: ContractReceipt = await fpTx.wait();
      const fpBn = fpRc.blockNumber;
      const fpOrderId = getOrderId721(
        fpBn,
        basic.address,
        1,
        acc02.address,
      );
      await mine(10);

      // Set ERC20 balances and approve for maretplace purchase
      const erc20Tx = await erc20
        .connect(acc01)
        .approve(m721.address, price);
      expect(erc20Tx).to.be.ok;
      const result = await erc20.callStatic.allowance(
        acc01.address,
        m721.address,
      );
      expect(result).to.equal(price);

      // Buy the token
      const buyTx = await m721.connect(acc01).buy(fpOrderId);

      // Test ERC20 buy response
      await expect(buyTx)
        .to.be.ok.and.to.emit(m721, "Claim")
        .withArgs(
          basicAddr,
          1,
          fpOrderId,
          acc02.address,
          acc01.address,
          price,
        );

      // Validate buyer and seller ERC20 balances
      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee)
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8")),
      );

      expect(await erc20.balanceOf(acc01.address)).to.equal(
        erc20Balance.sub(ethers.utils.parseEther("1")),
      );

      // Validate buyer ERC20 balances after royalties paid out
      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee) + 10%.royalties
      const splitTxCreator = await splitter[
        "release(address,address)"
      ](erc20.address, acc02.address);
      expect(splitTxCreator).to.be.ok;
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8"))
          .add(ethers.utils.parseEther("0.08")),
      );

      // Validate ERC2O amb payout balances
      const splitTxAmb = await splitter[
        "release(address,address)"
      ](erc20.address, amb.address);
      expect(splitTxAmb).to.be.ok;
      expect(await erc20.balanceOf(amb.address)).to.equal(
        ethers.utils.parseEther("0.02"),
      );

      // Validate ERC2O MAD fee payout balances
      expect(
        await erc20.balanceOf(
          await m721.callStatic.recipient(),
        ),
      ).to.equal(
        ownerERC20Bal.add(ethers.utils.parseEther("0.1")),
      );
    });
    it("Should revert bid if bidder has insufficient ERC20 balance", async () => {
      // acc02 = seller
      // acc01 = buyer
      await m721.updateSettings(300, 10, 20, 31536000);
      await f721
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f721.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );

      // Mint the token with erc20
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      expect(erc20MintTx).to.be.ok;
      await r721
        .connect(acc02)
        .basicMintTo(basic.address, acc02.address, 1);
      const tx = await basic
        .connect(acc02)
        .approve(m721.address, 1);
      const blockTimestamp = (
        await m721.provider.getBlock(tx.blockNumber || 0)
      ).timestamp;

      const fpTx = await m721
        .connect(acc02)
        .englishAuction(
          basic.address,
          1,
          price,
          blockTimestamp + 301,
        );
      const fpRc: ContractReceipt = await fpTx.wait();
      const fpBn = fpRc.blockNumber;
      const fpOrderId = getOrderId721(
        fpBn,
        basic.address,
        1,
        acc02.address,
      );

      await expect(
        m721.connect(acc01).bid(fpOrderId),
      ).to.be.revertedWithCustomError(
        m721,
        MarketplaceErrors.WrongPrice,
      );
    });
    it("Should bid, then out bid and win token with ERC20, distribute ERC20 splitter and fees", async () => {
      // acc02 = seller
      // acc01 = buyer

      const ownerERC20Bal = await erc20.balanceOf(
        await m721.callStatic.recipient(),
      );

      // Mint token
      await m721.updateSettings(300, 10, 20, 31536000);
      await f721
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f721.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "cid/id.json",
          splAddr,
          1000,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      const splitter = await ethers.getContractAt(
        "SplitterImpl",
        splAddr,
      );

      // Mint the token with erc20
      await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      await r721
        .connect(acc02)
        .basicMintTo(basic.address, acc02.address, 1);

      // acc02 = erc20Balance - 0.25
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance.sub(ethers.utils.parseEther("0.25")),
      );

      // List token
      const tx = await basic
        .connect(acc02)
        .approve(m721.address, 1);
      const blockTimestamp = (
        await m721.provider.getBlock(tx.blockNumber || 0)
      ).timestamp;
      const fpTx = await m721
        .connect(acc02)
        .englishAuction(
          basic.address,
          1,
          ethers.utils.parseEther("0.1"),
          blockTimestamp + 301,
        );
      const fpRc: ContractReceipt = await fpTx.wait();
      const fpBn = fpRc.blockNumber;
      const fpOrderId = getOrderId721(
        fpBn,
        basic.address,
        1,
        acc02.address,
      );

      // Bid for the token
      await erc20
        .connect(acc01)
        .approve(
          m721.address,
          ethers.utils.parseEther("0.1"),
        );
      const bidTx = await m721.connect(acc01).bid(fpOrderId);
      expect(bidTx).to.be.ok; // bid 1
      await mine(300);

      // Bid for the token and wait for auction to close, then claim
      await erc20.connect(acc01).approve(m721.address, price);
      const bidTx2 = await m721.connect(acc01).bid(fpOrderId); // bid again?
      expect(bidTx2).to.be.ok;

      // wait for auction to close and claim
      await mine(600);
      const claimTx = await m721
        .connect(acc01)
        .claim(fpOrderId);

      // Test ERC20 buy response
      await expect(claimTx)
        .to.be.ok.and.to.emit(m721, "Claim")
        .withArgs(
          basicAddr,
          1,
          fpOrderId,
          acc02.address,
          acc01.address,
          price,
        );

      // Validate buyer and seller ERC20 balances
      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee)
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8")),
      );
      expect(await erc20.balanceOf(acc01.address)).to.equal(
        // we didn't reclaim yet
        erc20Balance
          .sub(ethers.utils.parseEther("1"))
          .sub(ethers.utils.parseEther("0.1")),
      );

      const bal = await m721
        .connect(acc01.address)
        .getOutbidBalance();
      expect(bal).to.equal(ethers.utils.parseEther("0.1"));

      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee) + 10%.royalties
      const splitTxCreator = await splitter[
        "release(address,address)"
      ](erc20.address, acc02.address);
      expect(splitTxCreator).to.be.ok;
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8"))
          .add(ethers.utils.parseEther("0.08")),
      );

      // Validate ERC2O amb payout balances
      const splitTxAmb = await splitter[
        "release(address,address)"
      ](erc20.address, amb.address);
      expect(splitTxAmb).to.be.ok;
      expect(await erc20.balanceOf(amb.address)).to.equal(
        ethers.utils.parseEther("0.02"),
      );

      // Validate ERC2O MAD fee payout balances
      expect(
        await erc20.balanceOf(
          await m721.callStatic.recipient(),
        ),
      ).to.equal(
        ownerERC20Bal.add(ethers.utils.parseEther("0.1")),
      );

      // user withdraw their balance
      expect(
        await m721
          .connect(acc01)
          .withdrawOutbid(erc20.address, 0, 0),
      ).to.be.ok;

      const bal2 = await m721
        .connect(acc01)
        .getOutbidBalance();
      expect(bal2).to.equal(0);

      expect(await erc20.balanceOf(acc01.address)).to.equal(
        // we didn't reclaim yet
        erc20Balance.sub(ethers.utils.parseEther("1")),
      );
    });

    // this is a polygon test
    it("Should bid, then out bid and win token with ERC20, distribute ERC20 splitter and fees, withdraw ERC20 (swapped to WBTC)", async () => {
      // acc02 = seller
      // acc01 = buyer
      const ownerERC20Bal = await erc20.balanceOf(
        await m721.callStatic.recipient(),
      );

      // Mint token
      await m721.updateSettings(300, 10, 20, 31536000);
      await f721
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f721.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "cid/id.json",
          splAddr,
          1000,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      const splitter = await ethers.getContractAt(
        "SplitterImpl",
        splAddr,
      );

      // Mint the token with erc20
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      expect(erc20MintTx).to.be.ok;
      await r721
        .connect(acc02)
        .basicMintTo(basic.address, acc02.address, 1);

      // acc02 = erc20Balance - 0.25
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance.sub(ethers.utils.parseEther("0.25")),
      );

      // List token
      const tx = await basic
        .connect(acc02)
        .approve(m721.address, 1);
      const blockTimestamp = (
        await m721.provider.getBlock(tx.blockNumber || 0)
      ).timestamp;
      const fpTx = await m721
        .connect(acc02)
        .englishAuction(
          basic.address,
          1,
          ethers.utils.parseEther("0.1"),
          blockTimestamp + 301,
        );
      const fpRc: ContractReceipt = await fpTx.wait();
      const fpBn = fpRc.blockNumber;
      const fpOrderId = getOrderId721(
        fpBn,
        basic.address,
        1,
        acc02.address,
      );

      // Bid for the token
      await erc20
        .connect(acc01)
        .approve(
          m721.address,
          ethers.utils.parseEther("0.1"),
        );
      const bidTx = await m721.connect(acc01).bid(fpOrderId);
      expect(bidTx).to.be.ok; // bid 1
      await mine(300);

      // Bid for the token and wait for auction to close, then claim
      await erc20.connect(acc01).approve(m721.address, price);
      const bidTx2 = await m721.connect(acc01).bid(fpOrderId); // bid again?
      expect(bidTx2).to.be.ok;

      // wait for auction to close and claim
      await mine(600);
      const claimTx = await m721
        .connect(acc01)
        .claim(fpOrderId);

      // Test ERC20 buy response
      await expect(claimTx)
        .to.be.ok.and.to.emit(m721, "Claim")
        .withArgs(
          basicAddr,
          1,
          fpOrderId,
          acc02.address,
          acc01.address,
          price,
        );

      // Validate buyer and seller ERC20 balances
      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee)
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8")),
      );
      expect(await erc20.balanceOf(acc01.address)).to.equal(
        // we didn't reclaim yet
        erc20Balance
          .sub(ethers.utils.parseEther("1"))
          .sub(ethers.utils.parseEther("0.1")),
      );

      const bal = await m721
        .connect(acc01.address)
        .getOutbidBalance();
      expect(bal).to.equal(ethers.utils.parseEther("0.1"));

      // acc02 = erc20Balance - 0.25 + (1 - 10%.royalties - 10%.fee) + 10%.royalties
      const splitTxCreator = await splitter[
        "release(address,address)"
      ](erc20.address, acc02.address);
      expect(splitTxCreator).to.be.ok;
      expect(await erc20.balanceOf(acc02.address)).to.equal(
        erc20Balance
          .sub(ethers.utils.parseEther("0.25"))
          .add(ethers.utils.parseEther("0.8"))
          .add(ethers.utils.parseEther("0.08")),
      );

      // Validate ERC2O amb payout balances
      const splitTxAmb = await splitter[
        "release(address,address)"
      ](erc20.address, amb.address);
      expect(splitTxAmb).to.be.ok;
      expect(await erc20.balanceOf(amb.address)).to.equal(
        ethers.utils.parseEther("0.02"),
      );

      // Validate ERC2O MAD fee payout balances
      expect(
        await erc20.balanceOf(
          await m721.callStatic.recipient(),
        ),
      ).to.equal(
        ownerERC20Bal.add(ethers.utils.parseEther("0.1")),
      );

      // user withdraw their balance
      expect(
        await m721
          .connect(acc01)
          .withdrawOutbid(erc20.address, 0, 0),
      ).to.be.ok;

      const bal2 = await m721
        .connect(acc01)
        .getOutbidBalance();
      expect(bal2).to.equal(0);

      expect(await erc20.balanceOf(acc01.address)).to.equal(
        // we didn't reclaim yet
        erc20Balance.sub(ethers.utils.parseEther("1")),
      );
    });
  });
});
