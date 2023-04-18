import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Wallet } from "ethers";
import { ethers, network } from "hardhat";

import {
  ERC721Basic,
  MockERC20,
  SplitterImpl,
} from "../../../src/types";
import { BasicErrors } from "../../utils/errors";
import { basicFixture721ERC20 } from "../../utils/fixtures";
import {
  ERC165Interface,
  ERC721Interface,
  ERC721MetadataInterface,
  ERC2981Interface,
  getInterfaceID,
} from "../../utils/interfaces";

// hint:
// import { base64 } from "ethers/lib/utils";

describe("ERC721Basic - ERC20", () => {
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
  let basic: ERC721Basic;
  let erc20: MockERC20;

  const erc20Balance: BigNumber =
    ethers.utils.parseEther("10000");
  const fundAmount: BigNumber =
    ethers.utils.parseEther("10000");
  const price: BigNumber = ethers.utils.parseEther("1");
  const change =
    "VmlydHVhbGx5IGV2ZXJ5dGhpbmcgaXMgcGx1bmRlcmVkLCBidXQgYWJzb2x1dGVseSBldmVyeXRoaW5nIGlzIGZyZWUu";

  before("Set signers and reset network", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [owner, amb, mad, acc01, acc02] = await (
      ethers as any
    ).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ basic, splitter, erc20 } = await loadFixture(
      basicFixture721ERC20,
    ));
    await erc20.transfer(acc01.address, erc20Balance);
    await erc20.transfer(acc02.address, erc20Balance);
  });

  describe("Init", async () => {
    it("Splitter and ERC721 should initialize with ERC20", async () => {
      await basic.deployed();
      await splitter.deployed();
      expect(basic).to.be.ok;
      expect(splitter).to.be.ok;
      expect(await basic.callStatic.erc20()).to.eq(
        erc20.address,
      );
      expect(await basic.callStatic.name()).to.eq("721Basic");
      expect(await basic.callStatic.symbol()).to.eq("BASIC");
      expect(await basic.callStatic.price()).to.eq(price);
      expect(await basic.callStatic.maxSupply()).to.eq(1000);
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
      const tx = basic.connect(acc01).mint(1);
      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.PublicMintClosed,
      );
    });

    it("Should revert if max supply has reached max", async () => {
      await basic.setPublicMintState(true);
      const erc20MintTx = await erc20
        .connect(acc01)
        .approve(
          basic.address,
          price.mul(BigNumber.from(1000)),
        );
      expect(erc20MintTx).to.be.ok;
      await basic.connect(acc01).mint(1000);
      const erc20MintTx2 = await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(BigNumber.from(1)));
      expect(erc20MintTx2).to.be.ok;
      const tx = basic.connect(acc02).mint(1);
      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.MaxSupplyReached,
      );
    });

    it("Should revert if ERC20 price is wrong", async () => {
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(basic.address, 999);
      expect(erc20MintTx).to.be.ok;
      await basic.setPublicMintState(true);
      const tx = basic.connect(acc02).mint(1);

      await expect(tx).to.be.revertedWithCustomError(
        basic,
        BasicErrors.WrongPrice,
      );
    });

    it("Should mint with ERC20, update storage and emit events", async () => {
      const erc20MintTx = await erc20
        .connect(acc02)
        .approve(basic.address, price);
      expect(erc20MintTx).to.be.ok;

      await basic.setPublicMintState(true);
      const tx = await basic.connect(acc02).mint(1);
      const from = ethers.constants.AddressZero;
      const ownerOf = await basic.callStatic.ownerOf(1);
      const bal = await basic.callStatic.balanceOf(
        acc02.address,
      );

      expect(tx).to.be.ok;
      expect(1).to.eq(bal);
      expect(acc02.address).to.eq(ownerOf);
      await expect(tx)
        .to.emit(basic, "Transfer")
        .withArgs(from, acc02.address, 1);
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
      const tx1 = await basic.connect(acc01).mint(10);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx2amount));
      const tx2 = await basic.connect(acc02).mint(68);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx3amount));
      const tx3 = await basic.connect(acc02).mint(100);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx4amount));
      const tx4 = await basic.connect(acc02).mint(500);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(tx5amount));
      const tx5 = await basic.connect(acc02).mint(322);

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(tx3).to.be.ok;
      expect(tx4).to.be.ok;
      expect(tx5).to.be.ok;
    });
  });

  describe("Burn", async () => {
    it("Should revert if not owner", async () => {
      const ids = [1];
      const tx = basic
        .connect(acc02)
        .burn(ids, acc02.address);

      await expect(tx).to.be.revertedWith(
        BasicErrors.Unauthorized,
      );
    });

    it("Should revert if id is already burnt/hasn't been minted", async () => {
      const amount = ethers.BigNumber.from(4);
      const ids = [1, 2, 5];

      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.setPublicMintState(true);
      await basic.connect(acc02).mint(4);
      const tx = basic
        .connect(owner)
        .burn(ids, acc02.address);

      await expect(tx).to.be.revertedWith(
        BasicErrors.NotMinted,
      );
    });

    it("Should revert if ids length is less than 2", async () => {
      const Counters = await ethers.getContractFactory(
        "Counters",
      );
      await expect(
        basic.burn([1], acc01.address),
      ).to.be.revertedWithCustomError(
        Counters,
        BasicErrors.DecrementOverflow,
      );
    });

    it("Should mint, burn then mint again, update storage and emit event", async () => {
      const amount = ethers.BigNumber.from(2);
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc02).mint(2);
      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc01).mint(2);
      const ids = [1, 2, 3, 4];
      const tx = await basic.burn(ids, acc01.address);
      const dead = ethers.constants.AddressZero;
      await erc20
        .connect(acc01)
        .approve(basic.address, price.mul(amount));
      await basic.connect(acc01).mint(2);
      const bal1 = await basic.callStatic.balanceOf(
        acc01.address,
      );
      const bal2 = await basic.callStatic.balanceOf(
        acc02.address,
      );
      const approved1 = await basic.callStatic.getApproved(1);
      const approved2 = await basic.callStatic.getApproved(2);
      const approved3 = await basic.callStatic.getApproved(3);
      const approved4 = await basic.callStatic.getApproved(4);
      const mintCounter = await basic.callStatic.mintCount();

      expect(tx).to.be.ok;
      expect(bal1).to.eq(2);
      expect(bal2).to.eq(0);
      expect(approved1).to.eq(dead);
      expect(approved2).to.eq(dead);
      expect(approved3).to.eq(dead);
      expect(approved4).to.eq(dead);
      expect(mintCounter).to.eq(6);

      await expect(tx)
        .to.emit(basic, "Transfer")
        .withArgs(acc02.address, dead, 1);
      await expect(tx)
        .to.emit(basic, "Transfer")
        .withArgs(acc02.address, dead, 2);
      await expect(tx)
        .to.emit(basic, "Transfer")
        .withArgs(acc01.address, dead, 3);
      await expect(tx)
        .to.emit(basic, "Transfer")
        .withArgs(acc01.address, dead, 4);
    });
  });

  describe("Withdraw", async () => {
    it("Should withdraw contract's ERC20 royality funds", async () => {
      await basic.setPublicMintState(true);
      await erc20
        .connect(acc02)
        .approve(basic.address, price);
      await basic.connect(acc02).mint(1);

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
        await erc20.connect(acc02).balanceOf(basic.address),
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
      await erc20
        .connect(acc01)
        .approve(basic.address, price);
      await basic.setPublicMintState(true);
      await basic.connect(acc01).mint(1);
      const tx = await basic.callStatic.tokenURI(1);
      const fail = basic.callStatic.tokenURI(2);

      expect(tx).to.be.ok;
      expect(tx).to.eq("ipfs://cid/1.json");

      await expect(fail).to.be.revertedWithCustomError(
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

    it("Should support interfaces", async () => {
      const erc165 =
        getInterfaceID(ERC165Interface).interfaceID._hex;
      const erc2981 = getInterfaceID(ERC2981Interface)
        .interfaceID._hex;
      const erc721 =
        getInterfaceID(ERC721Interface).interfaceID._hex;
      const erc721meta = getInterfaceID(
        ERC721MetadataInterface,
      ).interfaceID._hex;

      const instrospec =
        await basic.callStatic.supportsInterface(erc165);
      const royalty =
        await basic.callStatic.supportsInterface(erc2981);
      const nft = await basic.callStatic.supportsInterface(
        erc721,
      );
      const metadata =
        await basic.callStatic.supportsInterface(erc721meta);

      await expect(instrospec).to.eq(true);
      await expect(royalty).to.eq(true);
      await expect(nft).to.eq(true);
      await expect(metadata).to.eq(true);
    });
  });
});
