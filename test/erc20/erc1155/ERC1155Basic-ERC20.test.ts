import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Wallet } from "ethers";
import { ethers, network } from "hardhat";

import {
  ERC1155Basic,
  MockERC20,
  SplitterImpl,
} from "../../../src/types";
import { BasicErrors } from "../../utils/errors";
import {
  basicFixture1155ERC20, // erc20Fixture,
} from "../../utils/fixtures";
import {
  ERC165Interface,
  ERC1155Interface,
  ERC1155MetadataInterface,
  ERC2981Interface,
  getInterfaceID,
} from "../../utils/interfaces";

describe("ERC1155Basic", () => {
  /* 
  For the sake of solely testing the nft functionalities, we consider 
  the user as the contract's owner, and the marketplace just as the 
  recipient for the royalties distribution; even though these tx 
  would've been proxied through the marketplace address when the 
  other core contracts are taken into account.
  */

  type WalletWithAddress = Wallet & SignerWithAddress;

  // contract deployer/admin
  let owner: WalletWithAddress;

  // ambassador
  let amb: WalletWithAddress;

  // marketplace address
  let mad: WalletWithAddress;

  // extra EOAs
  let acc01: WalletWithAddress;
  let acc02: WalletWithAddress;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any;

  let splitter: SplitterImpl;
  let basic: ERC1155Basic;
  let erc20: MockERC20;

  const erc20Balance: BigNumber =
    ethers.utils.parseEther("10000");
  const fundAmount: BigNumber =
    ethers.utils.parseEther("10000");
  const price: BigNumber = ethers.utils.parseEther("1");
  const change =
    "VmlydHVhbGx5IGV2ZXJ5dGhpbmcgaXMgcGx1bmRlcmVkLCBidXQgYWJzb2x1dGVseSBldmVyeXRoaW5nIGlzIGZyZWUu";

  before("Set signers and reset network", async () => {
    [owner, amb, mad, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ basic, splitter, erc20 } = await loadFixture(
      basicFixture1155ERC20,
    ));
    await erc20.transfer(acc01.address, erc20Balance);
    await erc20.transfer(acc02.address, erc20Balance);
    await erc20.transfer(amb.address, erc20Balance);
  });

  describe("Init", async () => {
    it("Splitter and ERC1155 should initialize", async () => {
      await basic.deployed();
      await splitter.deployed();
      expect(basic).to.be.ok;
      expect(splitter).to.be.ok;
      expect(await basic.callStatic.price()).to.eq(price);
      expect(await basic.callStatic.maxSupply()).to.eq(1000);
      expect(await basic.callStatic.erc20()).to.eq(
        erc20.address,
      );
      expect(await basic.callStatic.publicMintState()).to.eq(
        false,
      );
      expect(await basic.callStatic.splitter()).to.eq(
        splitter.address,
      );
      expect(await splitter.callStatic.totalShares()).to.eq(
        100,
      );
      expect(await splitter.callStatic._payees(0)).to.eq(
        mad.address,
      );
      expect(await splitter.callStatic._payees(1)).to.eq(
        amb.address,
      );
      expect(await splitter.callStatic._payees(2)).to.eq(
        owner.address,
      );
      await expect(await basic.deployTransaction)
        .to.emit(basic, "RoyaltyFeeSet")
        .withArgs(750)
        .and.to.emit(basic, "RoyaltyRecipientSet")
        .withArgs(splitter.address);
    });

    it("accounts have been funded", async () => {
      // can't be eq to ethAmount due to contract deployment cost
      res = await ethers.provider.getBalance(owner.address);
      expect(res.toString()).to.have.lengthOf(22);

      // those should eq to hardhat prefunded account's value
      expect(
        await ethers.provider.getBalance(amb.address),
      ).to.eq(fundAmount);
      expect(
        await ethers.provider.getBalance(mad.address),
      ).to.eq(fundAmount);
      expect(
        await ethers.provider.getBalance(acc01.address),
      ).to.eq(fundAmount);
      expect(
        await ethers.provider.getBalance(acc02.address),
      ).to.eq(fundAmount);
    });
  });

  // each describe tests a set of functionalities of the contract's behavior
  describe("Only owner setters", async () => {
    it("Should set base URI, emit event and revert if not owner", async () => {
      const set = await basic
        .connect(owner)
        .setBaseURI(change);
      const check = await basic.callStatic.baseURI();
      const setFail = basic.connect(acc01).setBaseURI("fail");

      expect(set).to.be.ok;
      expect(check).to.eq(change);

      await expect(set)
        .to.emit(basic, "BaseURISet")
        .withArgs(change);
      await expect(setFail).to.be.revertedWith(
        BasicErrors.Unauthorized,
      );
    });

    it("Should set public mint state, emit event & revert if not owner", async () => {
      const set = await basic
        .connect(owner)
        .setPublicMintState(true);
      const check = await basic.callStatic.publicMintState();
      const setFail = basic
        .connect(acc02)
        .setPublicMintState(false);

      expect(set).to.be.ok;
      expect(check).to.eq(true);

      await expect(set)
        .to.emit(basic, "PublicMintStateSet")
        .withArgs(true);
      await expect(setFail).to.be.revertedWith(
        BasicErrors.Unauthorized,
      );
    });
  });

  describe("Mint", async () => {
    it("Should revert if public mint is turned off", async () => {
      const tx = basic.connect(acc01).mint(1, 1);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.PublicMintClosed,
      );
    });

    it("Should revert if max supply has reached max", async () => {
      await basic.setPublicMintState(true);
      const amount = BigNumber.from(1000);
      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc01).mint(1000, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      const tx = basic.connect(acc02).mint(1, 1);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.MaxSupplyReached,
      );
    });

    it("Should revert if price is wrong", async () => {
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, 101010);
      const tx = basic.connect(acc02).mint(1, 1);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.WrongPrice,
      );
    });

    it("Should mint, update storage and emit events", async () => {
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price);
      const tx = await basic.connect(acc02).mint(1, 1);
      const from = ethers.constants.AddressZero;

      const bal = await basic.callStatic.balanceOf(
        acc02.address,
        1,
      );
      expect(tx).to.be.ok;
      expect(1).to.eq(bal);
      await expect(tx)
        .to.emit(basic, "TransferSingle")
        .withArgs(acc02.address, from, acc02.address, 1, 1);
    });

    it("Should handle multiple mints", async () => {
      await basic.setPublicMintState(true);

      const txamount = BigNumber.from(10);
      const tx2amount = BigNumber.from(68);
      const tx3amount = BigNumber.from(100);
      const tx4amount = BigNumber.from(500);
      const tx5amount = BigNumber.from(322);

      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(txamount));
      const tx1 = await basic.connect(acc01).mint(10, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx2amount));
      const tx2 = await basic.connect(acc02).mint(68, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx3amount));
      const tx3 = await basic.connect(acc02).mint(100, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx4amount));
      const tx4 = await basic.connect(acc02).mint(500, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx5amount));
      const tx5 = await basic.connect(acc02).mint(322, 1);

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(tx3).to.be.ok;
      expect(tx4).to.be.ok;
      expect(tx5).to.be.ok;
    });
  });

  describe("Batch mint", async () => {
    it("Should revert if supply has reached max", async () => {
      await basic.setPublicMintState(true);
      const id = [24];
      const amount = ethers.BigNumber.from(1000);
      await erc20
        .connect(owner)
        .approve(basic.address, price.mul(amount));
      await basic.mint(1000, 1);
      await erc20.connect(mad).approve(basic.address, price);
      const tx = basic.connect(mad).mintBatch(id, [1]);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.MaxSupplyReached,
      );
    });

    it("Should revert if public mint is turned off", async () => {
      const id = [25];
      await erc20
        .connect(acc01)
        .approve(basic.address, price);
      const tx = basic.connect(acc01).mint(id, [1]);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.PublicMintClosed,
      );
    });

    it("Should revert if price is wrong", async () => {
      await basic.setPublicMintState(true);
      const amount = ethers.BigNumber.from(4);
      const ids = [23, 13, 400];

      await erc20
        .connect(owner)
        .approve(basic.address, price.mul(amount));
      const tx = basic.mintBatch(ids, [1, 1, 1]);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.WrongPrice,
      );
    });

    it("Should batch mint, update storage and emit events", async () => {
      await basic.setPublicMintState(true);
      const dead = ethers.constants.AddressZero;
      const amount = ethers.BigNumber.from(3);
      const one = ethers.constants.One;
      const zero = ethers.constants.Zero;
      const ids = [123, 14, 500];
      const amounts = [one, one, one];

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      const tx = await basic
        .connect(acc02)
        .mintBatch(ids, [1, 1, 1]);
      const balNull = await basic.callStatic.balanceOf(
        acc02.address,
        1,
      );
      const balA = await basic.callStatic.balanceOf(
        acc02.address,
        123,
      );
      const balB = await basic.callStatic.balanceOf(
        acc02.address,
        14,
      );
      const balC = await basic.callStatic.balanceOf(
        acc02.address,
        500,
      );

      expect(tx).to.be.ok;
      expect(zero).to.eq(balNull);
      expect(one).to.eq(balA);
      expect(one).to.eq(balB);
      expect(one).to.eq(balC);

      await expect(tx)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          acc02.address,
          dead,
          acc02.address,
          ids,
          amounts,
        );
    });

    it("Should handle multiple batch mints", async () => {
      await basic.setPublicMintState(true);
      const dead = ethers.constants.AddressZero;
      const amount = ethers.BigNumber.from(3);
      const one = ethers.constants.One;
      const zero = ethers.constants.Zero;
      const ids1 = [123, 14, 500];
      const ids2 = [566, 145, 1000];
      const ids3 = [1, 33, 7];
      const amounts = [one, one, one];

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      const tx1 = await basic
        .connect(acc02)
        .mintBatch(ids1, [1, 1, 1]);

      await erc20
        .connect(owner)
        .approve(basic.address, price.mul(amount));
      const tx2 = await basic
        .connect(owner)
        .mintBatch(ids2, [1, 1, 1]);

      await erc20
        .connect(amb)
        .approve(basic.address, price.mul(amount));
      const tx3 = await basic
        .connect(amb)
        .mintBatch(ids3, [1, 1, 1]);

      const balNull = await basic.callStatic.balanceOf(
        acc02.address,
        0,
      );
      const balA = await basic.callStatic.balanceOf(
        acc02.address,
        ids1[2],
      );
      const balB = await basic.callStatic.balanceOf(
        owner.address,
        ids2[2],
      );
      const balC = await basic.callStatic.balanceOf(
        amb.address,
        ids3[0],
      );

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(tx3).to.be.ok;
      expect(zero).to.eq(balNull);
      expect(one).to.eq(balA);
      expect(one).to.eq(balB);
      expect(one).to.eq(balC);

      await expect(tx1)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          acc02.address,
          dead,
          acc02.address,
          ids1,
          amounts,
        );
      await expect(tx2)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          dead,
          owner.address,
          ids2,
          amounts,
        );
      await expect(tx3)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          amb.address,
          dead,
          amb.address,
          ids3,
          amounts,
        );
    });
  });

  describe("Burn", async () => {
    it("Should revert if not owner", async () => {
      const ids = [1];
      const tx = basic
        .connect(acc02)
        .burn([acc01.address], ids, [1], acc02.address);

      await expect(tx).to.be.revertedWith(
        BasicErrors.Unauthorized,
      );
    });

    it("Should revert if id is already burnt/hasn't been minted", async () => {
      const amount = ethers.BigNumber.from(4);
      const ids = [1, 2, 5];
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(4, 1);
      const tx = basic
        .connect(owner)
        .burn(
          [acc02.address, acc02.address, acc02.address],
          ids,
          [1, 1, 1],
          owner.address,
        );

      await expect(tx).to.be.revertedWith(
        BasicErrors.InvalidAmount,
      );
    });

    it("Should revert if ids length is less than 2", async () => {
      const counters = await ethers.getContractFactory(
        "Counters",
      );
      await expect(
        basic.burn([acc02.address], [1], [1], owner.address),
      ).to.be.revertedWithCustomError(
        counters,
        BasicErrors.DecrementOverflow,
      );
    });

    it("Should mint, burn then mint again, update storage and emit event", async () => {
      //ID 1,2 will be minted in first mint call
      //ID 3,4 will be minted in second mint call
      //ID 1,2 will be burn in burn call
      //ID 5,6 will be minted in third mint call. so mintCounter will be 6 in last
      const amount = ethers.BigNumber.from(2);
      await basic.setPublicMintState(true);

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(2, 1); // mintCount = 2

      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc01).mint(2, 1); // mintCount = 4

      // this will not effect mintCount as we are not decrementing the counter, only the liveSupply is decrementing
      const tx = await basic.burn(
        [acc02.address, acc02.address],
        [1, 2],
        [1, 1],
        owner.address,
      );
      const dead = ethers.constants.AddressZero;

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(2, 2); // mintCount = 6

      const bal1 = await basic.callStatic.balanceOf(
        acc01.address,
        4,
      );
      const mintCounter = await basic.callStatic.mintCount();

      expect(tx).to.be.ok;
      expect(bal1).to.eq(1);
      expect(mintCounter).to.eq(6);
      await expect(tx)
        .to.emit(basic, "TransferSingle")
        .withArgs(owner.address, acc02.address, dead, 1, 1);
      await expect(tx)
        .to.emit(basic, "TransferSingle")
        .withArgs(owner.address, acc02.address, dead, 2, 1);

      const tx2 = await basic.burn(
        [acc01.address, acc01.address],
        [3, 4],
        [1, 1],
        owner.address,
      );

      const bal2 = await basic.callStatic.balanceOf(
        acc02.address,
        3,
      );

      expect(tx2).to.be.ok;
      expect(bal2).to.eq(0);

      await expect(tx2)
        .to.emit(basic, "TransferSingle")
        .withArgs(owner.address, acc01.address, dead, 3, 1);
      await expect(tx2)
        .to.emit(basic, "TransferSingle")
        .withArgs(owner.address, acc01.address, dead, 4, 1);
    });
  });

  describe("Batch burn", async () => {
    it("Should revert if caller is not the owner", async () => {
      const amount = ethers.BigNumber.from(3);
      const ids = [1, 2, 3];
      await basic.setPublicMintState(true);
      await erc20
        .connect(owner)
        .approve(basic.address, price.mul(amount));
      await basic.mint(3, 1);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      const tx = basic
        .connect(acc02)
        .burnBatch(
          owner.address,
          ids,
          [1, 1, 1],
          acc02.address,
        );

      await expect(tx).to.be.revertedWith(
        BasicErrors.Unauthorized,
      );
    });

    it("Should revert if id is already burnt/hasn't been minted", async () => {
      const amount = ethers.BigNumber.from(4);
      const ids = [1, 2, 5];
      await basic.setPublicMintState(true);

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(4, 1);
      const tx = basic
        .connect(owner)
        .burnBatch(
          acc02.address,
          ids,
          [1, 1, 1],
          owner.address,
        );

      await expect(tx).to.be.revertedWith(
        BasicErrors.WrongFrom,
      );
    });

    it("Should batch burn tokens, update storage and emit event", async () => {
      const dead = ethers.constants.AddressZero;
      const one = ethers.constants.One;
      const amounts = [one, one];
      const amount = ethers.BigNumber.from(2);
      await basic.setPublicMintState(true);

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(2, 1);
      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc01).mint(2, 1);
      const ids1 = [1, 2];
      const ids2 = [3, 4];
      const tx1 = await basic.burnBatch(
        acc02.address,
        ids1,
        [1, 1],
        owner.address,
      );
      const tx2 = await basic.burnBatch(
        acc01.address,
        ids2,
        [1, 1],
        owner.address,
      );
      const bal1 = await basic.callStatic.balanceOf(
        acc02.address,
        1,
      );
      const bal2 = await basic.callStatic.balanceOf(
        acc02.address,
        2,
      );
      const bal3 = await basic.callStatic.balanceOf(
        acc01.address,
        3,
      );
      const bal4 = await basic.callStatic.balanceOf(
        acc01.address,
        4,
      );

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(bal1).to.eq(0);
      expect(bal2).to.eq(0);
      expect(bal3).to.eq(0);
      expect(bal4).to.eq(0);

      await expect(tx1)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc02.address,
          dead,
          ids1,
          amounts,
        );
      await expect(tx2)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc01.address,
          dead,
          ids2,
          amounts,
        );
    });

    it("Should handle multiple batch burns", async () => {
      const dead = ethers.constants.AddressZero;
      const one = ethers.constants.One;
      const amounts = [one, one, one, one, one];
      const amount = ethers.BigNumber.from(20);
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(20, 1);
      const ids1 = [1, 2, 3, 4, 5];
      const ids2 = [6, 7, 8, 9, 10];
      const ids3 = [11, 12, 13, 14, 15];
      const ids4 = [16, 17, 18, 19, 20];
      const tx1 = await basic.burnBatch(
        acc02.address,
        ids1,
        [1, 1, 1, 1, 1],
        owner.address,
      );
      const tx2 = await basic.burnBatch(
        acc02.address,
        ids2,
        [1, 1, 1, 1, 1],
        owner.address,
      );
      const tx3 = await basic.burnBatch(
        acc02.address,
        ids3,
        [1, 1, 1, 1, 1],
        owner.address,
      );
      const tx4 = await basic.burnBatch(
        acc02.address,
        ids4,
        [1, 1, 1, 1, 1],
        owner.address,
      );

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(tx3).to.be.ok;
      expect(tx4).to.be.ok;
      await expect(tx1)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc02.address,
          dead,
          ids1,
          amounts,
        );
      await expect(tx2)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc02.address,
          dead,
          ids2,
          amounts,
        );
      await expect(tx3)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc02.address,
          dead,
          ids3,
          amounts,
        );
      await expect(tx4)
        .to.emit(basic, "TransferBatch")
        .withArgs(
          owner.address,
          acc02.address,
          dead,
          ids4,
          amounts,
        );
    });
  });

  describe("Withdraw", async () => {
    it("Should mint with ERC20, then withdraw contract's ERC20 funds", async () => {
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price);
      await basic.connect(acc02).mint(1, 1);

      const addrs = [
        mad.address,
        amb.address,
        owner.address,
        basic.address,
      ];
      const shares = [
        ethers.BigNumber.from(1000),
        ethers.BigNumber.from(2000),
        ethers.BigNumber.from(7000),
      ];
      const vals = [
        shares[0].mul(price).div(10_000),
        shares[1].mul(price).div(10_000),
        shares[2].mul(price).div(10_000),
        "-1000000000000000000",
      ];

      await expect(() =>
        basic.withdrawERC20(
          erc20.address,
          ethers.constants.AddressZero,
        ),
      ).to.changeTokenBalances(erc20, addrs, vals);

      expect(
        await erc20.connect(owner).balanceOf(basic.address),
      ).to.eq(ethers.constants.Zero);

      await expect(
        basic
          .connect(acc01)
          .withdrawERC20(
            erc20.address,
            ethers.constants.AddressZero,
          ),
      ).to.be.revertedWith(BasicErrors.Unauthorized);
    });

    it("Should withdraw contract's ERC20s", async () => {
      const prevBal = BigNumber.from(2).pow(255);
      const payees = [
        mad.address,
        amb.address,
        owner.address,
      ];
      const shares = [
        ethers.BigNumber.from(1000),
        ethers.BigNumber.from(2000),
        ethers.BigNumber.from(7000),
      ];
      const vals = [
        shares[0].mul(price).div(10_000),
        shares[1].mul(price).div(10_000),
        shares[2].mul(price).div(10_000).add(prevBal),
      ];
      const ERC20 = await ethers.getContractFactory(
        "MockERC20",
      );
      const erc20 = (await ERC20.deploy(
        prevBal,
      )) as MockERC20;

      await erc20.mint(basic.address, price);

      const tx = await basic.withdrawERC20(
        erc20.address,
        ethers.constants.AddressZero,
      );
      expect(tx).to.be.ok;
      expect(
        await erc20.callStatic.balanceOf(payees[0]),
      ).to.eq(vals[0]);
      expect(
        await erc20.callStatic.balanceOf(payees[1]),
      ).to.eq(vals[1]);
      expect(
        await erc20.callStatic.balanceOf(payees[2]),
      ).to.eq(vals[2]);
      expect(
        await erc20.callStatic.balanceOf(basic.address),
      ).to.eq(ethers.constants.Zero);
    });
  });

  describe("Public getters", async () => {
    it("Should query royalty info", async () => {
      const share = BigNumber.from(750);
      const base = BigNumber.from(10000);
      const amount = price.mul(share).div(base);
      const tx = await basic.royaltyInfo(1, price);

      expect(tx[0]).to.eq(splitter.address);
      expect(tx[1]).to.eq(amount);
    });

    it("Should query token uri and revert if not yet minted", async () => {
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc01)
        .approve(basic.address, price);
      await basic.connect(acc01).mint(1, 1);
      const tx = await basic.callStatic.uri(1);

      expect(tx).to.be.ok;
      expect(tx).to.eq("ipfs://cid/1.json");

      await expect(
        basic.uri(2),
      ).to.be.revertedWithCustomError(
        basic,
        BasicErrors.NotMintedYet,
      );
    });

    it("Should query total supply", async () => {
      const tx = await basic.callStatic.totalSupply();

      expect(tx).to.be.ok;
      expect(tx).to.eq(0);
    });

    it("Should query mint count", async () => {
      const tx = await basic.callStatic.mintCount();
      expect(tx).to.be.ok;
      expect(tx).to.eq(0);
    });

    it("Should query base uri", async () => {
      const base = "ipfs://cid/";
      const tx = await basic.callStatic.baseURI();

      expect(tx).to.be.ok;
      expect(tx).to.eq(base);
    });
  });

  describe("Interface IDs", async () => {
    it("Should support interfaces", async () => {
      const erc165 =
        getInterfaceID(ERC165Interface).interfaceID._hex;
      const erc2981 = getInterfaceID(ERC2981Interface)
        .interfaceID._hex;
      const erc1155 = getInterfaceID(ERC1155Interface)
        .interfaceID._hex;
      const erc1155meta = getInterfaceID(
        ERC1155MetadataInterface,
      ).interfaceID._hex;

      const instrospec =
        await basic.callStatic.supportsInterface(erc165);
      const royalty =
        await basic.callStatic.supportsInterface(erc2981);
      const nft = await basic.callStatic.supportsInterface(
        erc1155,
      );
      const metadata =
        await basic.callStatic.supportsInterface(erc1155meta);

      await expect(instrospec).to.eq(true);
      await expect(royalty).to.eq(true);
      await expect(nft).to.eq(true);
      await expect(metadata).to.eq(true);
    });
  });
});
