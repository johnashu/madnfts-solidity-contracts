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
  MockERC20__factory,
} from "../../../../src/types";
// import { MarketplaceErrors } from "../../../test/utils/errors";
import {
  dead,
  getOrderId721,
  madFixture721F,
} from "../../../utils/madFixtures";

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
  let acc03: WalletWithAddress;

  let f721: MADFactory721;
  let m721: MADMarketplace721;
  let r721: MADRouter721;
  let erc20: MockERC20;

  const price: BigNumber = ethers.utils.parseEther("1");
  const erc20Balance: BigNumber =
    ethers.utils.parseEther("500");

  before("Set signers", async () => {
    [owner, amb, acc01, acc02, acc03] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset", [
      {
        forking: {
          jsonRpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
          blockNumber: 39835000,
        },
      },
    ]);
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ f721, m721, r721, erc20 } = await loadFixture(
      madFixture721F,
    ));
    await r721.deployed();
    await m721.deployed();
    await f721.deployed();
    let tx = await acc01.sendTransaction({
      to: erc20.address,
      value: erc20Balance,
    });
    await tx.wait();

    tx = await acc02.sendTransaction({
      to: erc20.address,
      value: erc20Balance,
    });
    await tx.wait();

    tx = await acc03.sendTransaction({
      to: erc20.address,
      value: erc20Balance,
    });
    await tx.wait();
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
    // this is a polygon test
    it("Should bid, then out bid and win token with ERC20, distribute ERC20 splitter and fees, withdraw ERC20 (swapped to WMATIC - no swap)", async () => {
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
  });

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
    await erc20
      .connect(acc02)
      .approve(r721.address, ethers.utils.parseEther("0.25"));
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
      .approve(m721.address, ethers.utils.parseEther("0.1"));
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

    const erc20_btc = MockERC20__factory.connect(
      "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      acc01,
    );
    expect(await erc20_btc.balanceOf(acc01.address)).to.equal(
      0,
    );

    // user withdraw their balance
    expect(
      await m721
        .connect(acc01)
        .withdrawOutbid(
          "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
          0,
          0,
        ),
    ).to.be.ok;
    const bal2 = await m721.connect(acc01).getOutbidBalance();
    expect(bal2).to.equal(0);

    expect(await erc20_btc.balanceOf(acc01.address)).to.be.gt(
      0,
    );

    expect(await erc20.balanceOf(acc01.address)).to.equal(
      // claimed but got BTC
      erc20Balance
        .sub(ethers.utils.parseEther("1"))
        .sub(ethers.utils.parseEther("0.1")),
    );
  });
  it("Test full end-to-end purchase and then withdraw; pause then clear the contract of the tokens (outbid and sold out)", async () => {
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
      .approve(r721.address, ethers.utils.parseEther("0.25"));
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
      .approve(m721.address, ethers.utils.parseEther("0.1"));
    const bidTx = await m721.connect(acc01).bid(fpOrderId);
    expect(bidTx).to.be.ok; // bid 1
    await mine(300);

    // Bid for the token and wait for auction to close, then claim
    await erc20.connect(acc01).approve(m721.address, price);
    const bidTx2 = await m721.connect(acc01).bid(fpOrderId); // bid again?
    expect(bidTx2).to.be.ok;

    await mine(300);

    await erc20
      .connect(acc03)
      .approve(m721.address, price.mul(2));
    const bidTx3 = await m721.connect(acc03).bid(fpOrderId); // bid again?
    expect(bidTx3).to.be.ok;

    // users bid
    // pause
    // user withdraw
    // with one bid stuck because the contract is paused

    await mine(600);
    await m721.pause();

    expect(await m721.totalOutbid()).to.be.equal(
      ethers.utils.parseEther("1.1"),
    );
    expect(await erc20.balanceOf(m721.address)).to.be.equal(
      ethers.utils.parseEther("3.1"),
    );

    await m721.connect(owner).withdrawERC20();

    // withdraw outbids
    await m721
      .connect(acc01)
      .withdrawOutbid(erc20.address, 0, 0);
    await m721
      .connect(acc03)
      .withdrawOutbid(erc20.address, 0, 0);

    expect(await m721.totalOutbid()).to.be.equal(
      ethers.utils.parseEther("0"),
    );
    expect(await erc20.balanceOf(m721.address)).to.be.equal(
      ethers.utils.parseEther("0"),
    );

    await expect(m721.connect(owner).withdrawERC20()).to.be
      .reverted;
  });

  it("Test full end-to-end purchase and then withdraw; pause then clear the contract of the tokens (outbid and sold out and auto-withdraw)", async () => {
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
      .approve(r721.address, ethers.utils.parseEther("0.25"));
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
      .approve(m721.address, ethers.utils.parseEther("0.1"));
    const bidTx = await m721.connect(acc01).bid(fpOrderId);
    expect(bidTx).to.be.ok; // bid 1
    await mine(300);

    // Bid for the token and wait for auction to close, then claim
    await erc20.connect(acc01).approve(m721.address, price);
    const bidTx2 = await m721.connect(acc01).bid(fpOrderId); // bid again?
    expect(bidTx2).to.be.ok;

    await mine(300);

    await erc20
      .connect(acc03)
      .approve(m721.address, price.mul(2));
    const bidTx3 = await m721.connect(acc03).bid(fpOrderId); // bid again?
    expect(bidTx3).to.be.ok;

    // users bid
    // pause
    // user withdraw
    // with one bid stuck because the contract is paused

    await mine(600);
    await m721.pause();

    expect(await m721.totalOutbid()).to.be.equal(
      ethers.utils.parseEther("1.1"),
    );
    expect(await erc20.balanceOf(m721.address)).to.be.equal(
      ethers.utils.parseEther("3.1"),
    );

    // withdraw after pause

    await m721.connect(owner).withdrawERC20();

    // withdraw outbids
    await m721
      .connect(acc03)
      .withdrawOutbid(erc20.address, 0, 0);

    await expect(
      m721.connect(acc01).withdrawOutbid(erc20.address, 0, 0),
    ).to.be.ok;

    await expect(
      m721.connect(acc01).withdrawOutbid(erc20.address, 0, 0),
    ).to.be.reverted;

    await expect(m721.connect(owner).withdrawERC20()).to.be
      .reverted;

    expect(await m721.totalOutbid()).to.be.equal(
      ethers.utils.parseEther("0"),
    );
    expect(await erc20.balanceOf(m721.address)).to.be.equal(
      ethers.utils.parseEther("0"),
    );
  });
});
