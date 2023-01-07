import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  Signature,
  Wallet,
} from "ethers";
import { ethers, network } from "hardhat";

import {
  ERC721Lazy,
  MockERC20,
  SplitterImpl,
} from "../src/types";
import { LazyErrors } from "./utils/errors";
import {
  lazyFixture721ERC20, // erc20Fixture,
} from "./utils/fixtures";
import {
  ERC165Interface,
  ERC721Interface,
  ERC721MetadataInterface,
  ERC2981Interface,
  Voucher,
  getInterfaceID,
} from "./utils/interfaces";

describe("ERC721Lazy - ERC20", () => {
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
  let lazy: ERC721Lazy;
  let signature: string;
  let wrongSig: string;
  let voucher: Voucher;
  let voucher2: Voucher;
  let signerAddr: string;
  let recover: string;
  let domainCheck: string;
  let signer: Wallet;
  let sigSplit: Signature;
  let sigSplit2: Signature;
  let erc20: MockERC20;

  const fundAmount: BigNumber =
    ethers.utils.parseEther("10000");
  const price: BigNumber = ethers.utils.parseEther("1");
  const amount: BigNumber = ethers.BigNumber.from(30);

  before("Set signers and reset network", async () => {
    [owner, amb, mad, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({
      splitter,
      lazy,
      signature,
      signerAddr,
      recover,
      signer,
      domainCheck,
      wrongSig,
      sigSplit,
      sigSplit2,
      voucher,
      voucher2,
      erc20,
    } = await loadFixture(lazyFixture721ERC20));
  });

  describe("Init", async () => {
    it("Splitter and ERC721 should initialize with ERC20", async () => {
      await lazy.deployed();
      await splitter.deployed();
      expect(lazy).to.be.ok;
      expect(splitter).to.be.ok;

      // deployment settings check
      expect(await lazy.callStatic.name()).to.eq("721Lazy");
      expect(await lazy.callStatic.symbol()).to.eq("LAZY");
      expect(await lazy.callStatic.erc20()).to.eq(erc20.address);

      await expect(await lazy.deployTransaction)
        .to.emit(lazy, "RoyaltyFeeSet")
        .withArgs(750)
        .and.to.emit(lazy, "RoyaltyRecipientSet")
        .withArgs(splitter.address)
        .and.to.emit(lazy, "SignerUpdated")
        .withArgs(signer.address);

      // splitter settings
      expect(await lazy.callStatic.splitter()).to.eq(
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

  describe("Lazy mint", async () => {
    it("Should mint with ERC20, update storage and emit events", async () => {
      const dead = ethers.constants.AddressZero;
      const deploy: ContractTransaction =
        await lazy.deployTransaction;
      const rc: ContractReceipt = await deploy.wait();
      const event = rc.events?.find(
        event => event.event === "SignerUpdated",
      );
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const _signerAddr = event?.args!["newSigner"];
      const bal = await lazy.callStatic.balanceOf(
        owner.address,
      );
      const bal2 = await lazy.callStatic.balanceOf(
        amb.address,
      );
      const bal3 = await lazy.callStatic.balanceOf(
        mad.address,
      );
      const sup = await lazy.callStatic.totalSupply();

      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      const tx = await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const sup2 = lazy.callStatic.totalSupply();
      const ownerOfA = lazy.callStatic.ownerOf(1);
      const ownerOfB = lazy.callStatic.ownerOf(14);
      const ownerOfC = lazy.callStatic.ownerOf(24);

      // expect(cDomain).to.eq(domainCheck);
      expect(recover)
        .to.eq(_signerAddr.toLowerCase())
        .and.to.eq(signerAddr);
      expect(signature.length).to.eq(132);
      expect(tx).to.be.ok;
      expect(bal).to.eq(0);
      expect(bal2).to.eq(0);
      expect(bal3).to.eq(0);
      expect(sup).to.eq(0);
      expect(
        await lazy.callStatic.balanceOf(owner.address),
      ).to.eq(10);
      expect(
        await lazy.callStatic.balanceOf(amb.address),
      ).to.eq(10);
      expect(
        await lazy.callStatic.balanceOf(mad.address),
      ).to.eq(10);
      expect(await ownerOfA).to.eq(owner.address);
      expect(await ownerOfB).to.eq(amb.address);
      expect(await ownerOfC).to.eq(mad.address);
      expect(await sup2).to.eq(30);
      expect(
        await lazy.callStatic.usedVouchers(voucher.voucherId),
      ).to.eq(true);
      await expect(tx)
        .to.emit(lazy, "Transfer")
        .withArgs(dead, owner.address, 6)
        .and.to.emit(lazy, "Transfer")
        .withArgs(dead, amb.address, 13)
        .and.to.emit(lazy, "Transfer")
        .withArgs(dead, mad.address, 27);
    });
    it("Should revert if voucher has already been used", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const tx = lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );

      await expect(tx).to.be.revertedWithCustomError(
        lazy,
        LazyErrors.UsedVoucher,
      );
    });
    it("Should revert if signature is invalid", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      const wSigSplit = ethers.utils.splitSignature(wrongSig);
      const tx = lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        wSigSplit.v,
        wSigSplit.r,
        wSigSplit.s,
        owner.address
      );

      await expect(tx).to.be.revertedWithCustomError(
        lazy,
        LazyErrors.InvalidSigner,
      );
    });
    it("Should revert if price is wrong", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price);
      expect(erc20ApproveTx).to.be.ok
      const tx = lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );

      await expect(tx).to.be.revertedWithCustomError(
        lazy,
        LazyErrors.WrongPrice,
      );
    });
  });

  // `setSigner` already tested in "Init"
  describe("Only owner functions", async () => {
    it("Should set baseURI and emit event", async () => {
      const res = "";
      const tx = await lazy.setBaseURI(res);
      const fail = lazy.connect(acc02).setBaseURI(res);

      expect(tx).to.be.ok;
      await expect(tx)
        .to.emit(lazy, "BaseURISet")
        .withArgs(res);
      await expect(fail).to.be.revertedWith(
        LazyErrors.Unauthorized,
      );
    });
    it("Should withdraw ERC20 and update balances", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const addrs = [
        mad.address,
        amb.address,
        owner.address,
        lazy.address
      ];
      const shares = [
        ethers.BigNumber.from(1000),
        ethers.BigNumber.from(2000),
        ethers.BigNumber.from(7000),
      ];
      const vals = [
        shares[0].mul(price.mul(amount)).div(10_000),
        shares[1].mul(price.mul(amount)).div(10_000),
        shares[2].mul(price.mul(amount)).div(10_000),
        "-30000000000000000000",
      ];

      await expect(() =>
        lazy.withdrawERC20(erc20.address)
      ).to.changeTokenBalances(erc20, addrs, vals);

      await expect(
        lazy.connect(acc02).withdrawERC20(erc20.address),
      ).to.be.revertedWith(LazyErrors.Unauthorized);
    });
  });

  describe("Burn", async () => {
    it("Should revert if not owner", async () => {
      await expect(
        lazy.connect(acc01)["burn(uint256[])"]([1]),
      ).to.be.revertedWith(LazyErrors.Unauthorized);
    });
    it("Should revert if id is already burnt/hasn't been minted", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const ids = [1, 33, 7];
      const tx = lazy.connect(owner)["burn(uint256[],address)"](ids, owner.address);

      await expect(tx).to.be.revertedWith(
        LazyErrors.NotMinted,
      );
    });
    it("Should revert if ids length is less than 2", async () => {
      const Counters = await ethers.getContractFactory(
        "Counters",
      );
      await expect(
        lazy["burn(uint256[],address)"]([1], owner.address),
      ).to.be.revertedWithCustomError(
        Counters,
        LazyErrors.DecrementOverflow,
      );
    });
    it("Should spend ERC20 to mint, burn then mint again, update storage and emit event", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );

      const ids = [1, 13, 20, 30];
      const tx = await lazy["burn(uint256[],address)"](ids, owner.address);

      const erc20ApproveTx2 = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx2).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher2,
        sigSplit2.v,
        sigSplit2.r,
        sigSplit2.s,
        owner.address
      );

      const dead = ethers.constants.AddressZero;
      const bal1 = await lazy.callStatic.balanceOf(
        owner.address,
      );
      const bal2 = await lazy.callStatic.balanceOf(
        amb.address,
      );
      const bal3 = await lazy.callStatic.balanceOf(
        mad.address,
      );
      const approved1 = await lazy.callStatic.getApproved(1);
      const approved2 = await lazy.callStatic.getApproved(13);
      const approved3 = await lazy.callStatic.getApproved(20);
      const approved4 = await lazy.callStatic.getApproved(30);
      const mintCounter = await lazy.callStatic.getMintCount();

      expect(tx).to.be.ok;
      expect(bal1).to.eq(19);
      expect(bal2).to.eq(18);
      expect(bal3).to.eq(19);
      expect(approved1).to.eq(dead);
      expect(approved2).to.eq(dead);
      expect(approved3).to.eq(dead);
      expect(approved4).to.eq(dead);
      expect(mintCounter).to.eq(60);

      await expect(tx)
        .to.emit(lazy, "Transfer")
        .withArgs(owner.address, dead, 1)
        .and.to.emit(lazy, "Transfer")
        .withArgs(amb.address, dead, 13)
        .and.to.emit(lazy, "Transfer")
        .withArgs(amb.address, dead, 20)
        .and.to.emit(lazy, "Transfer")
        .withArgs(mad.address, dead, 30);
    });
  });

  describe("Public getters", async () => {
    it("Should retrieve the domain separator", async () => {
      const cDomain = await lazy.DOMAIN_SEPARATOR();

      expect(cDomain).to.eq(domainCheck);
    });

    it("Should retrive baseURI and total supply", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      const res = "0x70616b6d616e";
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const base = await lazy.callStatic.getBaseURI();
      const sup = await lazy.callStatic.totalSupply();
      await lazy["burn(uint256[],address)"]([1, 2], owner.address);
      await lazy.setBaseURI(res);
      const base2 = await lazy.callStatic.getBaseURI();

      const sup2 = await lazy.callStatic.totalSupply();
      expect(base).to.be.ok;
      expect(sup).to.be.ok;
      expect(base).to.eq("ipfs://cid/");
      expect(base2).to.eq(res);
      expect(sup).to.eq(30);
      expect(sup2).to.eq(28);
    });
    
    it("Should retrive tokenURI and revert if not yet minted", async () => {
      const erc20ApproveTx = await erc20.connect(owner).approve(lazy.address, price.mul(amount));
      expect(erc20ApproveTx).to.be.ok
      await lazy["lazyMint((bytes32,address[],uint256[],uint256,uint256),uint8,bytes32,bytes32,address)"](
        voucher,
        sigSplit.v,
        sigSplit.r,
        sigSplit.s,
        owner.address
      );
      const tx = await lazy.callStatic.tokenURI(1);

      expect(tx).to.be.ok;
      expect(tx).to.eq("ipfs://cid/1.json");
      await expect(
        lazy.callStatic.tokenURI(777),
      ).to.be.revertedWithCustomError(
        lazy,
        LazyErrors.NotMintedYet,
      );
    });

    it("Should query royalty info", async () => {
      const share = BigNumber.from(750);
      const base = BigNumber.from(10000);
      const amount = price.mul(share).div(base);
      const tx = await lazy.royaltyInfo(1, price);

      expect(tx[0]).to.eq(splitter.address);
      expect(tx[1]).to.eq(amount);
    });

    it("Should query mint count", async () => {
      const tx = await lazy.callStatic.getMintCount();
      expect(tx).to.be.ok;
      expect(tx).to.eq(0);
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
        await lazy.callStatic.supportsInterface(erc165);
      const royalty = await lazy.callStatic.supportsInterface(
        erc2981,
      );
      const nft = await lazy.callStatic.supportsInterface(
        erc721,
      );
      const metadata =
        await lazy.callStatic.supportsInterface(erc721meta);

      await expect(instrospec).to.eq(true);
      await expect(royalty).to.eq(true);
      await expect(nft).to.eq(true);
      await expect(metadata).to.eq(true);
    });
  });
});
