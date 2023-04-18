import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Wallet } from "ethers";
import { artifacts, ethers, network } from "hardhat";

import {
  MADFactory721,
  MADMarketplace721,
  MADRouter721,
  MockERC20,
} from "../../src/types";
import { BasicErrors, RouterErrors } from "./../utils/errors";
import { getSignerAddrs } from "./../utils/fixtures";
import { dead, madFixture721B } from "./../utils/madFixtures";

describe("MADRouter721", () => {
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

  let f721: MADFactory721;
  let m721: MADMarketplace721;
  let r721: MADRouter721;
  // let erc20: MockERC20;

  const price: BigNumber = ethers.utils.parseEther("1");

  before("Set signers and reset network", async () => {
    console.log(ethers.utils.parseEther("2.5"));
    [owner, amb, mad, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ f721, m721, r721 } = await loadFixture(
      madFixture721B,
    ));
    await r721.deployed();
    await m721.deployed();
    await f721.deployed();
  });

  describe("Init", async () => {
    it("Router should initialize", async () => {
      expect(r721).to.be.ok;

      // check each global var
      expect(await r721.callStatic.name()).to.eq("router");
      expect(await r721.madFactory()).to.eq(f721.address);
    });
  });
  describe("Set baseURI", async () => {
    it("Should revert for locked base URI for all colTypes", async () => {
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

      // Basic
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
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      const tx1 = r721
        .connect(acc02)
        .setBase(basic.address, "null");
      const tx2 = r721
        .connect(acc02)
        .setBaseLock(basic.address);
      expect(await tx1).to.be.ok;
      expect(await tx2).to.be.ok;
      await expect(
        r721.connect(acc02).setBase(basic.address, "null"),
      ).to.be.revertedWithCustomError(
        basic,
        RouterErrors.URILocked,
      );
    });
    it("Should set baseURI for 721Basic collection type", async () => {
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
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const colID = await f721.callStatic.getColID(basicAddr);
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      const tx = await r721
        .connect(acc02)
        .setBase(basicAddr, "null");

      expect(tx).to.be.ok;
      await expect(tx)
        .to.emit(r721, "BaseURISet")
        .withArgs(colID, "null");
      expect(await basic.callStatic.baseURI()).to.eq("null");
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f721.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r721.connect(acc01).setBase(basicAddr, "void"),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });

  describe("Basic MintTo", async () => {
    it("Should call basicMintTo for 721Basic collection type", async () => {
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
      const tx = await r721
        .connect(acc02)
        .basicMintTo(basicAddr, acc01.address, 1, {
          value: ethers.utils.parseEther("0.25"),
        });

      expect(tx).to.be.ok;
      expect(await basic.callStatic.ownerOf(1)).to.eq(
        acc01.address,
      );
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f721.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r721
          .connect(mad)
          .basicMintTo(basicAddr, acc02.address, 1, {
            value: ethers.utils.parseEther("0.25"),
          }),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Burn", async () => {
    it("Should burn tokens for 721Basic collection type", async () => {
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
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      await r721.connect(acc02).setMintState(basicAddr, true);

      await basic.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const tx = await r721
        .connect(acc02)
        .burn(basicAddr, [1]);

      expect(tx).to.be.ok;
      expect(
        await basic.callStatic.balanceOf(acc01.address),
      ).to.eq(0);
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f721.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r721.burn(basicAddr, [1]),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Set MintState", async () => {
    it("Should revert for invalid stateType", async () => {
      const addr = await f721.getDeployedAddr("salt");
      const tx = r721.setMintState(addr, true);

      await expect(tx).to.be.revertedWithCustomError(
        f721,
        RouterErrors.AccessDenied,
      );
    });
    it("Should set publicMintState for minimal, basic and whitelist colTypes", async () => {
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
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );

      const tx2 = await r721
        .connect(acc02)
        .setMintState(basicAddr, true);

      expect(tx2).to.be.ok;

      expect(await basic.callStatic.publicMintState()).to.eq(
        true,
      );

      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f721.address,
        verArt.abi,
        ethers.provider,
      );

      await expect(
        r721.connect(acc01).setMintState(basicAddr, true),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Creator Withdraw", async () => {
    it("Should withdraw balance and ERC20 for all colTypes", async () => {
      const ERC20 = await ethers.getContractFactory(
        "MockERC20",
      );
      const erc20 = (await ERC20.deploy(
        BigNumber.from(2).pow(255),
      )) as MockERC20;

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
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      await erc20.mint(basic.address, price);
      await r721
        .connect(acc02)
        .setMintState(basic.address, true);
      await basic.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const bal1 = await ethers.provider.getBalance(
        acc02.address,
      );
      const bal2 = await erc20.balanceOf(acc02.address);
      const tx1 = await r721
        .connect(acc02)
        .withdraw(basic.address, dead);
      const tx2 = await r721
        .connect(acc02)
        .withdraw(basic.address, erc20.address);
      const newBal1 = await ethers.provider.getBalance(
        acc02.address,
      );
      const newBal2 = await erc20.balanceOf(acc02.address);

      const basicAddr2 =
        await f721.callStatic.getDeployedAddr("salt");
      await f721
        .connect(mad)
        .splitterCheck(
          "MADSplitter2",
          amb.address,
          dead,
          20,
          0,
        );
      const madSpl = await f721.callStatic.getDeployedAddr(
        "MADSplitter2",
      );

      await f721
        .connect(mad)
        .createCollection(
          1,
          "salt",
          "721Basic",
          "BAS",
          price,
          1000,
          "ipfs://cid/",
          madSpl,
          750,
        );
      const basic2 = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr2,
      );
      await erc20.mint(basic2.address, price);
      await r721
        .connect(mad)
        .setMintState(basic2.address, true);
      await basic2.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const bala = await ethers.provider.getBalance(
        mad.address,
      );
      const balb = await erc20.balanceOf(mad.address);
      const txa = await r721
        .connect(mad)
        .withdraw(basic2.address, dead);
      const txb = await r721
        .connect(mad)
        .withdraw(basic2.address, erc20.address);
      const newBala = await ethers.provider.getBalance(
        mad.address,
      );
      const newBalb = await erc20.balanceOf(mad.address);

      const wlAddr = await f721.callStatic.getDeployedAddr(
        "WhiteSalt",
      );
      await f721
        .connect(amb)
        .splitterCheck("MADSplitter3", dead, dead, 0, 0);
      const ambSpl = await f721.callStatic.getDeployedAddr(
        "MADSplitter3",
      );
      await f721
        .connect(amb)
        .createCollection(
          1,
          "WhiteSalt",
          "721Whitelist",
          "WHITE",
          price,
          1000,
          "ipfs://cid/",
          ambSpl,
          750,
        );
      const wl = await ethers.getContractAt(
        "ERC721Basic",
        wlAddr,
      );
      await erc20.mint(wl.address, price);
      await r721.connect(amb).setMintState(wl.address, true);
      await wl.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const balc = await ethers.provider.getBalance(
        amb.address,
      );
      const bald = await erc20.balanceOf(amb.address);
      const txc = await r721
        .connect(amb)
        .withdraw(wl.address, dead);
      const txd = await r721
        .connect(amb)
        .withdraw(wl.address, erc20.address);
      const newBalc = await ethers.provider.getBalance(
        amb.address,
      );
      const newBald = await erc20.balanceOf(amb.address);

      const userBffr = getSignerAddrs(
        10,
        await ethers.getSigners(),
      );
      const newUser = userBffr[9];

      await f721
        .connect(await ethers.getSigner(newUser))
        .splitterCheck("MADSplitter4", dead, dead, 0, 0);
      const userSpl = await f721.callStatic.getDeployedAddr(
        "MADSplitter4",
      );
      const lazyAddr = await f721.callStatic.getDeployedAddr(
        "LazySalt",
      );
      await f721
        .connect(await ethers.getSigner(newUser))
        .createCollection(
          1,
          "LazySalt",
          "721Lazy",
          "LAZY",
          price,
          100,
          "ipfs://cid/",
          userSpl,
          750,
        );
      const lazy = await ethers.getContractAt(
        "ERC721Basic",
        lazyAddr,
      );

      await erc20.mint(lazy.address, price);
      await r721
        .connect(await ethers.getSigner(newUser))
        .setMintState(lazy.address, true);
      await lazy.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });

      const bal3 = await ethers.provider.getBalance(newUser);
      const bal4 = await erc20.balanceOf(newUser);
      const tx3 = await r721
        .connect(await ethers.getSigner(newUser))
        .withdraw(lazy.address, dead);
      const tx4 = await r721
        .connect(await ethers.getSigner(newUser))
        .withdraw(lazy.address, erc20.address);
      const newBal3 = await ethers.provider.getBalance(
        newUser,
      );
      const newBal4 = await erc20.balanceOf(newUser);
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f721.address,
        verArt.abi,
        ethers.provider,
      );

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(bal1).to.be.lt(newBal1);
      // we no longer take 10% of platform fees
      expect(price.mul(8000).div(10_000)).to.be.eq(
        newBal2.sub(bal2),
      );

      await expect(
        r721
          .connect(acc01)
          .withdraw(basic.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r721
          .connect(acc02)
          .withdraw(basic.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r721.connect(acc02).withdraw(basic.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(txa).to.be.ok;
      expect(txb).to.be.ok;
      expect(bala).to.be.below(newBala);
      expect(balb).to.be.below(newBalb);

      await expect(
        r721
          .connect(acc01)
          .withdraw(basic2.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r721
          .connect(mad)
          .withdraw(basic2.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r721.connect(mad).withdraw(basic2.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(txc).to.be.ok;
      expect(txd).to.be.ok;
      expect(balc).to.be.lt(newBalc);
      expect(bald).to.be.lt(newBald);

      await expect(
        r721
          .connect(acc01)
          .withdraw(wl.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r721.connect(amb).withdraw(wl.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r721.connect(amb).withdraw(wl.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(tx3).to.be.ok;
      expect(tx4).to.be.ok;
      expect(bal3).to.be.below(newBal3);
      expect(bal4).to.be.below(newBal4);

      await expect(
        r721
          .connect(acc01)
          .withdraw(lazy.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r721
          .connect(await ethers.getSigner(newUser))
          .withdraw(lazy.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r721
          .connect(await ethers.getSigner(newUser))
          .withdraw(lazy.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);
    });
    it("Should withdraw balance and distribute public mint fees for all colTypes", async () => {
      // mad.address is creator - 10% royalties
      // amb.address is ambassador - 20%
      // recipient is fee receiver - 10%
      // acc01 is minter

      const recipient = r721.callStatic.recipient();

      // Set up a splitter
      await f721
        .connect(mad)
        .splitterCheck(
          "MADSplitter2",
          amb.address,
          dead,
          20,
          0,
        );
      const madSpl = await f721.callStatic.getDeployedAddr(
        "MADSplitter2",
      );

      // Set mint and burn fees
      await r721.setFees(
        ethers.utils.parseEther("2.5"),
        ethers.utils.parseEther("0.5"),
      );

      // Deploy MINIMAL contracts and set public mint = true
      const basicAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(mad)
        .createCollection(
          1,
          "BasicSalt",
          "721Basic",
          "BASIC",
          price,
          1,
          "ipfs://cid/id.json",
          madSpl,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr,
      );
      await r721
        .connect(mad)
        .setMintState(basic.address, true);

      // Record start balances
      const startBalMadMin = await ethers.provider.getBalance(
        mad.address,
      );
      const startBalAmbMin = await ethers.provider.getBalance(
        amb.address,
      );
      const startBalRecipientMin =
        await ethers.provider.getBalance(recipient);
      const startBalAcc01Min =
        await ethers.provider.getBalance(acc01.address);

      // Mint a public token - fee 2.5 + price 1
      const txMintMin = await basic.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("2.5")),
      });
      const receiptMintMin = await txMintMin.wait();
      const txMintGasMin = receiptMintMin.gasUsed.mul(
        receiptMintMin.effectiveGasPrice,
      );
      const txWithdrawMin = await r721
        .connect(mad)
        .withdraw(basic.address, dead);
      const receiptMin = await txWithdrawMin.wait();
      const txWithdrawGasMin = receiptMin.gasUsed.mul(
        receiptMin.effectiveGasPrice,
      );

      // Record end balances
      const endBalMadMin = await ethers.provider.getBalance(
        mad.address,
      );
      const endBalAmbMin = await ethers.provider.getBalance(
        amb.address,
      );
      const endBalRecipientMin =
        await ethers.provider.getBalance(recipient);
      const endBalAcc01Min = await ethers.provider.getBalance(
        acc01.address,
      );

      // mad.address = creator = - txWithdrawGas + 80% of price (remaining 20% goes to ambassador)
      expect(endBalMadMin).to.eq(
        startBalMadMin
          .sub(txWithdrawGasMin)
          .add(ethers.utils.parseEther("0.8")),
      );
      // amb.address = ambassador = + 20% of price (remaining 80% goes to creator)
      expect(endBalAmbMin).to.eq(
        startBalAmbMin.add(ethers.utils.parseEther("0.2")),
      );
      // owner.address = MAD receiver = + 100% mint fees
      expect(endBalRecipientMin).to.eq(
        startBalRecipientMin.add(
          ethers.utils.parseEther("2.5"),
        ),
      );
      // acc01.address = buyer = - price - fee - txFees
      expect(endBalAcc01Min).to.eq(
        startBalAcc01Min
          .sub(txMintGasMin)
          .sub(ethers.utils.parseEther("3.5")),
      );

      // Deploy BASIC contracts and set public mint = true
      const basicAddr2 =
        await f721.callStatic.getDeployedAddr("salt");
      await f721
        .connect(mad)
        .createCollection(
          1,
          "salt",
          "721Basic2",
          "BAS2",
          price,
          1000,
          "ipfs://cid/",
          madSpl,
          1000,
        );
      const basic2 = await ethers.getContractAt(
        "ERC721Basic",
        basicAddr2,
      );
      await r721
        .connect(mad)
        .setMintState(basic2.address, true);

      // Record start balances
      const startBalMad = await ethers.provider.getBalance(
        mad.address,
      );
      const startBalAmb = await ethers.provider.getBalance(
        amb.address,
      );
      const startBalRecipient =
        await ethers.provider.getBalance(recipient);
      const startBalAcc01 = await ethers.provider.getBalance(
        acc01.address,
      );

      // Mint a public token - fee 2.5 + price 1
      const txMint = await basic2.connect(acc01).mint(1, {
        value: price.add(ethers.utils.parseEther("2.5")),
      });
      const receiptMint = await txMint.wait();
      const txMintGas = receiptMint.gasUsed.mul(
        receiptMint.effectiveGasPrice,
      );
      const txWithdraw = await r721
        .connect(mad)
        .withdraw(basic2.address, dead);
      const receipt = await txWithdraw.wait();
      const txWithdrawGas = receipt.gasUsed.mul(
        receipt.effectiveGasPrice,
      );

      // Record end balances
      const endBalMad = await ethers.provider.getBalance(
        mad.address,
      );
      const endBalAmb = await ethers.provider.getBalance(
        amb.address,
      );
      const endBalRecipient =
        await ethers.provider.getBalance(recipient);
      const endBalAcc01 = await ethers.provider.getBalance(
        acc01.address,
      );

      // mad.address = creator = - txWithdrawGas + 80% of price (remaining 20% goes to ambassador)
      expect(endBalMad).to.eq(
        startBalMad
          .sub(txWithdrawGas)
          .add(ethers.utils.parseEther("0.8")),
      );
      // amb.address = ambassador = + 20% of price (remaining 80% goes to creator)
      expect(endBalAmb).to.eq(
        startBalAmb.add(ethers.utils.parseEther("0.2")),
      );
      // owner.address = MAD receiver = + 100% mint fees
      expect(endBalRecipient).to.eq(
        startBalRecipient.add(ethers.utils.parseEther("2.5")),
      );
      // acc01.address = buyer = - price - fee - txFees
      expect(endBalAcc01).to.eq(
        startBalAcc01
          .sub(txMintGas)
          .sub(ethers.utils.parseEther("3.5")),
      );
    });
  });
  describe("Only Owner", async () => {
    it("Should update contract's owner", async () => {
      const tx = await r721.setOwner(mad.address);

      expect(tx).to.be.ok;
      await expect(tx)
        .to.emit(r721, "OwnerUpdated")
        .withArgs(owner.address, mad.address);
      expect(await r721.callStatic.owner()).to.eq(
        mad.address,
      );
      await expect(
        r721.connect(acc02).setOwner(acc01.address),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
    });
    it("Should initialize paused and unpaused states", async () => {
      const addr = await f721.callStatic.getDeployedAddr(
        "salt",
      );
      const tx = await r721.pause();
      expect(tx).to.be.ok;
      await expect(
        r721.connect(acc01).pause(),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
      await expect(r721.setBase(addr, "")).to.be.revertedWith(
        RouterErrors.Paused,
      );

      await expect(
        r721.burn(addr, [1, 2, 3]),
      ).to.be.revertedWith(RouterErrors.Paused);
      await expect(
        r721.setMintState(addr, false),
      ).to.be.revertedWith(RouterErrors.Paused);

      await expect(
        r721.connect(acc02).unpause(),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
      expect(await r721.unpause()).to.be.ok;
    });
  });

  describe("Set Fee Set Max Tests", async () => {
    it("Should allow setting fees below and at the limit (2.5 eth and 0.5 eth for our fixtures)", async () => {
      await expect(
        r721.setFees(
          ethers.utils.parseEther("2.4"),
          ethers.utils.parseEther("0.4"),
        ),
      ).to.be.ok;

      await expect(
        r721.setFees(
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("0.5"),
        ),
      ).to.be.ok;

      await expect(
        r721.setFees(
          ethers.utils.parseEther("2.6"),
          ethers.utils.parseEther("0.6"),
        ),
      ).to.be.reverted;
    });
  }),
    describe("Burn-setBaseFee", async () => {
      it("Should burn tokens for 721Basic collection type", async () => {
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
        const basicAddr =
          await f721.callStatic.getDeployedAddr("BasicSalt");
        await f721
          .connect(acc02)
          .createCollection(
            1,
            "BasicSalt",
            "721Basic",
            "BASIC",
            price,
            1000,
            "ipfs://cid/",
            splAddr,
            750,
          );
        await r721.setFees(
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("0.5"),
        );

        const basic = await ethers.getContractAt(
          "ERC721Basic",
          basicAddr,
        );
        await r721
          .connect(acc02)
          .setMintState(basicAddr, true);
        await basic.connect(acc01).mint(1, {
          value: price.add(ethers.utils.parseEther("2.5")),
        });

        await expect(
          r721.connect(acc02).burn(basicAddr, [1]),
        ).to.be.revertedWithCustomError(
          basic,
          BasicErrors.WrongPrice,
        );

        const tx = await r721
          .connect(acc02)
          .burn(basicAddr, [1], {
            value: ethers.utils.parseEther("0.5"),
          });

        expect(tx).to.be.ok;
        expect(
          await basic.callStatic.balanceOf(acc01.address),
        ).to.eq(0);
        const verArt = await artifacts.readArtifact(
          "FactoryVerifier",
        );
        const ver = new ethers.Contract(
          f721.address,
          verArt.abi,
          ethers.provider,
        );
        await expect(
          r721.burn(basicAddr, [1], {
            value: ethers.utils.parseEther("0.5"),
          }),
        ).to.be.revertedWithCustomError(
          ver,
          RouterErrors.AccessDenied,
        );
      });
      //   it("Should burn tokens for 721Whitelist collection type", async () => {
      //     const root = ethers.utils.keccak256(
      //       ethers.utils.toUtf8Bytes("fakeRoot"),
      //     );
      //
      //     await f721
      //       .connect(acc02)
      //       .splitterCheck(
      //         "MADSplitter1",
      //         amb.address,
      //         dead,
      //         20,
      //         0,
      //       );
      //     const splAddr = await f721.callStatic.getDeployedAddr(
      //       "MADSplitter1",
      //     );
      //     const wlAddr = await f721.callStatic.getDeployedAddr(
      //       "WhiteSalt",
      //     );
      //     await f721
      //       .connect(acc02)
      //       .createCollection(
      //         2,
      //         "WhiteSalt",
      //         "721Whitelist",
      //         "WHITE",
      //         price,
      //         1000,
      //         "ipfs://cid/",
      //         splAddr,
      //         750,
      //       );
      //     const wl = await ethers.getContractAt(
      //       "ERC721Whitelist",
      //       wlAddr,
      //     );
      //     await r721
      //       .connect(acc02)
      //       .freeSettings(wl.address, 1, 10, root);
      //     await r721
      //       .connect(acc02)
      //       .creatorMint(wlAddr, 1, {
      //         value: ethers.utils.parseEther("0.25"),
      //       });
      //     const tx = await r721.connect(acc02).burn(wlAddr, [1]);
      //     const verArt = await artifacts.readArtifact(
      //       "FactoryVerifier",
      //     );
      //     const ver = new ethers.Contract(
      //       f721.address,
      //       verArt.abi,
      //       ethers.provider,
      //     );
      //     await r721.setFees(
      //       ethers.utils.parseEther("2.5"),
      //       ethers.utils.parseEther("0.5"),
      //     );
      //     expect(tx).to.be.ok;
      //     expect(
      //       await wl.callStatic.balanceOf(acc02.address),
      //     ).to.eq(0);
      //     await expect(
      //       r721.burn(wlAddr, [1]),
      //     ).to.be.revertedWithCustomError(
      //       ver,
      //       RouterErrors.AccessDenied,
      //     );
      //   });
      //   it("Should burn tokens for 721Lazy collection type", async () => {
      //     const signer = ethers.Wallet.createRandom();
      //
      //     await f721.setSigner(await signer.getAddress());
      //     await f721
      //       .connect(acc02)
      //       .splitterCheck(
      //         "MADSplitter1",
      //         amb.address,
      //         dead,
      //         20,
      //         0,
      //       );
      //     const splAddr = await f721.callStatic.getDeployedAddr(
      //       "MADSplitter1",
      //     );
      //     const lazyAddr = await f721.callStatic.getDeployedAddr(
      //       "LazySalt",
      //     );
      //     await f721
      //       .connect(acc02)
      //       .createCollection(
      //         3,
      //         "LazySalt",
      //         "721Lazy",
      //         "LAZY",
      //         ethers.constants.Zero,
      //         ethers.constants.Zero,
      //         "ipfs://cid/",
      //         splAddr,
      //         750,
      //       );
      //     const lazy = await ethers.getContractAt(
      //       "ERC721Lazy",
      //       lazyAddr,
      //     );
      //     const net = await lazy.provider.getNetwork();
      //     const chainId = net.chainId;
      //     const bnPrice = ethers.utils.parseEther("1");
      //     const usrs = [owner.address, acc02.address];
      //     const vId = ethers.utils.keccak256(
      //       ethers.utils.toUtf8Bytes("voucher"),
      //     );
      //     const pk = Buffer.from(
      //       signer.privateKey.slice(2),
      //       "hex",
      //     );

      //     const domain = [
      //       { name: "name", type: "string" },
      //       { name: "version", type: "string" },
      //       { name: "chainId", type: "uint256" },
      //       { name: "verifyingContract", type: "address" },
      //     ];
      //     const voucherType = [
      //       { name: "voucherId", type: "bytes32" },
      //       { name: "users", type: "address[]" },
      //       { name: "balances", type: "uint256[]" },
      //       { name: "amount", type: "uint256" },
      //       { name: "price", type: "uint256" },
      //     ];
      //     const domainData = {
      //       name: "721Lazy",
      //       version: "1",
      //       chainId: chainId,
      //       verifyingContract: lazy.address,
      //     };
      //     const Voucher = {
      //       voucherId: vId,
      //       users: usrs,
      //       balances: [1],
      //       amount: 1,
      //       price: bnPrice.toString(),
      //     };
      //     const data = JSON.stringify({
      //       types: {
      //         EIP712Domain: domain,
      //         Voucher: voucherType,
      //       },
      //       primaryType: "Voucher",
      //       domain: domainData,
      //       message: Voucher,
      //     });

      //     const parsedData = JSON.parse(data);
      //     const signature = signTypedData({
      //       privateKey: pk,
      //       data: parsedData,
      //       version: SignTypedDataVersion.V4,
      //     });

      //     const sigSplit = ethers.utils.splitSignature(signature);
      //     await r721.setFees(
      //       ethers.utils.parseEther("2.5"),
      //       ethers.utils.parseEther("0.5"),
      //     );
      //     await lazy
      //       .connect(acc02)
      //       .lazyMint(
      //         Voucher,
      //         sigSplit.v,
      //         sigSplit.r,
      //         sigSplit.s,
      //         { value: price.mul(ethers.BigNumber.from(2)).add(ethers.utils.parseEther("2.5")) },
      //       );
      //     await expect(
      //       r721.connect(acc02).burn(lazyAddr, [1, 2]),
      //     ).to.be.revertedWithCustomError(
      //       lazy,
      //       LazyErrors.WrongPrice,
      //     );
      //     const tx = await r721
      //       .connect(acc02)
      //       .burn(lazyAddr, [1, 2], {
      //         value: ethers.utils.parseEther("0.5"),
      //       });
      //     const verArt = await artifacts.readArtifact(
      //       "FactoryVerifier",
      //     );
      //     const ver = new ethers.Contract(
      //       f721.address,
      //       verArt.abi,
      //       ethers.provider,
      //     );

      //     expect(tx).to.be.ok;
      //     expect(await lazy.balanceOf(acc02.address)).to.eq(0);
      //     expect(await lazy.balanceOf(owner.address)).to.eq(0);
      //     await expect(
      //       r721.burn(lazyAddr, [1], {
      //         value: ethers.utils.parseEther("0.5"),
      //       }),
      //     ).to.be.revertedWithCustomError(
      //       ver,
      //       RouterErrors.AccessDenied,
      //     );
      //   });
    });
  // describe("Whitelist Creator Mint-setBaseFee", async () => {
  //   it("Should mint to creator", async () => {
  //
  //     await f721
  //       .connect(acc02)
  //       .splitterCheck(
  //         "MADSplitter1",
  //         amb.address,
  //         dead,
  //         20,
  //         0,
  //       );
  //     const splAddr = await f721.callStatic.getDeployedAddr(
  //       "MADSplitter1",
  //     );
  //     await f721
  //       .connect(acc02)
  //       .createCollection(
  //         2,
  //         "WhiteSalt",
  //         "721Whitelist",
  //         "WHITE",
  //         price,
  //         100,
  //         "ipfs://cid/",
  //         splAddr,
  //         750,
  //       );
  //     const wlAddr = await f721.callStatic.getDeployedAddr(
  //       "WhiteSalt",
  //     );
  //     const wl = await ethers.getContractAt(
  //       "ERC721Whitelist",
  //       wlAddr,
  //     );
  //     const root = ethers.utils.keccak256(
  //       ethers.utils.toUtf8Bytes("root"),
  //     );
  //     await r721.setFees(
  //       ethers.utils.parseEther("2.5"),
  //       ethers.utils.parseEther("0.5"),
  //     );
  //     await r721
  //       .connect(acc02)
  //       .freeSettings(wlAddr, 1, 10, root);
  //     await r721.connect(acc02).setMintState(wlAddr, true, 2);

  //     await expect(
  //       r721
  //         .connect(acc02)
  //         .creatorMint(wlAddr, 2, {
  //           value: ethers.utils.parseEther("0.25"),
  //         }),
  //     ).to.be.revertedWithCustomError(
  //       wl,
  //       WhitelistErrors.WrongPrice,
  //     );

  //     const tx = await r721
  //       .connect(acc02)
  //       .creatorMint(wlAddr, 2, {
  //         value: ethers.utils.parseEther("2.5"),
  //       });

  //     expect(tx).to.be.ok;
  //     expect(await wl.callStatic.freeClaimState()).to.be.true;
  //   });
  // });
  // describe("Whitelist token gifting-setBaseFee", async () => {
  //   it("Should gift tokens", async () => {
  //
  //     await f721
  //       .connect(acc02)
  //       .splitterCheck(
  //         "MADSplitter1",
  //         amb.address,
  //         dead,
  //         20,
  //         0,
  //       );
  //     const splAddr = await f721.callStatic.getDeployedAddr(
  //       "MADSplitter1",
  //     );
  //     await f721
  //       .connect(acc02)
  //       .createCollection(
  //         2,
  //         "WhiteSalt",
  //         "721Whitelist",
  //         "WHITE",
  //         price,
  //         100,
  //         "ipfs://cid/",
  //         splAddr,
  //         750,
  //       );
  //     const wlAddr = await f721.callStatic.getDeployedAddr(
  //       "WhiteSalt",
  //     );
  //     const wl = await ethers.getContractAt(
  //       "ERC721Whitelist",
  //       wlAddr,
  //     );
  //     const root = ethers.utils.keccak256(
  //       ethers.utils.toUtf8Bytes("root"),
  //     );
  //     await r721.setFees(
  //       ethers.utils.parseEther("2.5"),
  //       ethers.utils.parseEther("0.5"),
  //     );
  //     const addrs = [owner.address, mad.address];
  //     await r721
  //       .connect(acc02)
  //       .freeSettings(wlAddr, 1, 10, root);
  //     await r721.connect(acc02).setMintState(wlAddr, true, 2);

  //     await expect(
  //       r721
  //         .connect(acc02)
  //         .gift(wlAddr, addrs, {
  //           value: ethers.utils.parseEther("0.25"),
  //         }),
  //     ).to.be.revertedWithCustomError(
  //       wl,
  //       WhitelistErrors.WrongPrice,
  //     );

  //     const tx = await r721
  //       .connect(acc02)
  //       .gift(wlAddr, addrs, {
  //         value: ethers.utils.parseEther("2.5"),
  //       });

  //     expect(tx).to.be.ok;
  //     expect(
  //       await wl.callStatic.balanceOf(owner.address),
  //     ).to.eq(1);
  //     expect(
  //       await wl.callStatic.balanceOf(mad.address),
  //     ).to.eq(1);
  //   });
  // });
});
