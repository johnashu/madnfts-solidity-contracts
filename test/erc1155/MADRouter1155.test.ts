import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Wallet } from "ethers";
import { artifacts, ethers, network } from "hardhat";

import {
  MADFactory1155,
  MADMarketplace1155,
  MADRouter1155,
  MockERC20,
} from "../../src/types";
import { BasicErrors, RouterErrors } from "./../utils/errors";
import { getSignerAddrs } from "./../utils/fixtures";
import {
  dead,
  madFixture1155B,
} from "./../utils/madFixtures";

describe("MADRouter1155", () => {
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

  let f1155: MADFactory1155;
  let m1155: MADMarketplace1155;
  let r1155: MADRouter1155;

  const price: BigNumber = ethers.utils.parseEther("1");

  before("Set signers and reset network", async () => {
    [owner, amb, mad, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ f1155, m1155, r1155 } = await loadFixture(
      madFixture1155B,
    ));
    await r1155.deployed();
    await m1155.deployed();
    await f1155.deployed();
  });

  describe("Init", async () => {
    it("Router should initialize", async () => {
      expect(r1155).to.be.ok;

      // check each global var
      expect(await r1155.callStatic.name()).to.eq("router");
      expect(await r1155.madFactory()).to.eq(f1155.address);
    });
  });
  describe("Set URI", async () => {
    it("Should revert for locked base URI", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );

      // Basic
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1,
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      const tx1 = r1155
        .connect(acc02)
        .setBaseURI(basic.address, "null");
      const tx2 = r1155
        .connect(acc02)
        .setURILock(basic.address);
      expect(await tx1).to.be.ok;
      expect(await tx2).to.be.ok;
      await expect(
        r1155
          .connect(acc02)
          .setBaseURI(basic.address, "null"),
      ).to.be.revertedWithCustomError(
        basic,
        RouterErrors.URILocked,
      );
    });

    it("Should set URI for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const colID = await f1155.callStatic.getColID(
        basicAddr,
      );
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      const tx = await r1155
        .connect(acc02)
        .setBaseURI(basicAddr, "null");

      expect(tx).to.be.ok;
      await expect(tx)
        .to.emit(r1155, "BaseURISet")
        .withArgs(colID, "null");
      expect(await basic.callStatic.baseURI()).to.eq("null");
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155.connect(acc01).setBaseURI(basicAddr, "void"),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Burn", async () => {
    it("Should burn tokens for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await r1155
        .connect(acc02)
        .setMintState(basicAddr, true);
      await basic.connect(acc01).mint(1, 1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const tx = await r1155
        .connect(acc02)
        .burn(basicAddr, [1], [acc01.address], [1]);

      expect(tx).to.be.ok;
      expect(
        await basic.callStatic.balanceOf(acc01.address, 1),
      ).to.eq(0);
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155.burn(basicAddr, [1], [acc01.address], [1]),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Batch Burn", async () => {
    it("Should batch burn token for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const pmul = await ethers.BigNumber.from(4);
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await r1155
        .connect(acc02)
        .setMintState(basicAddr, true);
      await basic.connect(acc01).mint(4, 1, {
        value: price
          .mul(pmul)
          .add(ethers.utils.parseEther("0.25")),
      });
      const tx = await r1155
        .connect(acc02)
        .batchBurn(
          basicAddr,
          acc01.address,
          [1, 2, 3, 4],
          [1, 1, 1, 1],
        );

      expect(tx).to.be.ok;
      expect(
        await basic.callStatic.balanceOf(acc01.address, 1),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 2),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 3),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 4),
      ).to.eq(0);
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155.batchBurn(basicAddr, acc01.address, [1], [1]),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Set MintState", async () => {
    it("Should revert for invalid stateType", async () => {
      const addr = await f1155.getDeployedAddr("salt");
      const tx = r1155.setMintState(addr, true);

      await expect(tx).to.be.revertedWithCustomError(
        f1155,
        RouterErrors.AccessDenied,
      );
    });

    await f1155
      .connect(acc02)
      .splitterCheck(
        "MADSplitter1",
        amb.address,
        dead,
        20,
        0,
      );
    const splAddr = await f1155.callStatic.getDeployedAddr(
      "MADSplitter1",
    );
    const minAddr = await f1155.callStatic.getDeployedAddr(
      "MinSalt",
    );
    await f1155
      .connect(acc02)
      .createCollection(
        0,
        "MinSalt",
        "1155Min",
        "MIN",
        price,
        1,
        "ipfs://cid/id.json",
        splAddr,
        750,
      );
    const tx = r1155
      .connect(acc02)
      .setMintState(minAddr, true);

    await expect(tx).to.be.revertedWith(
      RouterErrors.InvalidType,
    );
    // });
    it("Should set publicMintState for minimal, basic and whitelist colTypes", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      const basicAddr2 =
        await f1155.callStatic.getDeployedAddr("BasicSalt2");
      const wlAddr = await f1155.callStatic.getDeployedAddr(
        "WhiteSalt",
      );
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1,
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt2",
          "1155Basic2",
          "BASIC2",
          price,
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const basic2 = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr2,
      );
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "WhiteSalt",
          "1155Whitelist",
          "WL",
          price,
          1,
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const wl = await ethers.getContractAt(
        "ERC1155Basic",
        wlAddr,
      );

      const tx1 = await r1155
        .connect(acc02)
        .setMintState(basicAddr, true);
      const tx2 = await r1155
        .connect(acc02)
        .setMintState(basicAddr, true);
      const tx3 = await r1155
        .connect(acc02)
        .setMintState(wlAddr, true);

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(tx3).to.be.ok;
      expect(await basic.callStatic.publicMintState()).to.eq(
        true,
      );
      expect(await basic2.callStatic.publicMintState()).to.eq(
        true,
      );
      expect(await wl.callStatic.publicMintState()).to.eq(
        true,
      );
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155.connect(acc01).setMintState(basicAddr, true),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155.connect(acc01).setMintState(basicAddr2, true),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155.connect(acc01).setMintState(wlAddr, true),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Creator Withdraw", async () => {
    it("Should withdraw balance and ERC20 for all colTypes", async () => {
      const prevBal = BigNumber.from(2).pow(255);
      const ERC20 = await ethers.getContractFactory(
        "MockERC20",
      );
      const erc20 = (await ERC20.deploy(
        prevBal,
      )) as MockERC20;

      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1,
          "ipfs://cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await erc20.mint(basic.address, price);
      await r1155
        .connect(acc02)
        .setMintState(basic.address, true);
      await basic.connect(acc01).mint(1, 1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const bal1 = await ethers.provider.getBalance(
        acc02.address,
      );
      const bal2 = await erc20.balanceOf(acc02.address);
      const tx1 = await r1155
        .connect(acc02)
        .withdraw(basic.address, dead);
      const tx2 = await r1155
        .connect(acc02)
        .withdraw(basic.address, erc20.address);
      const newBal1 = await ethers.provider.getBalance(
        acc02.address,
      );
      const newBal2 = await erc20.balanceOf(acc02.address);

      const basicAddr2 =
        await f1155.callStatic.getDeployedAddr("salt");
      await f1155
        .connect(mad)
        .splitterCheck(
          "MADSplitter2",
          amb.address,
          dead,
          20,
          0,
        );
      const madSpl = await f1155.callStatic.getDeployedAddr(
        "MADSplitter2",
      );

      await f1155
        .connect(mad)
        .createCollection(
          1,
          "salt",
          "",
          "",
          price,
          1000,
          "ipfs://cid/",
          madSpl,
          750,
        );
      const basic2 = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr2,
      );
      await erc20.mint(basic2.address, price);
      await r1155
        .connect(mad)
        .setMintState(basic2.address, true);
      await basic2.connect(acc01).mint(1, 1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const bala = await ethers.provider.getBalance(
        mad.address,
      );
      const balb = await erc20.balanceOf(mad.address);
      const txa = await r1155
        .connect(mad)
        .withdraw(basic2.address, dead);
      const txb = await r1155
        .connect(mad)
        .withdraw(basic2.address, erc20.address);
      const newBala = await ethers.provider.getBalance(
        mad.address,
      );
      const newBalb = await erc20.balanceOf(mad.address);

      const wlAddr = await f1155.callStatic.getDeployedAddr(
        "WhiteSalt",
      );
      await f1155
        .connect(amb)
        .splitterCheck("MADSplitter3", dead, dead, 0, 0);
      const ambSpl = await f1155.callStatic.getDeployedAddr(
        "MADSplitter3",
      );
      await f1155
        .connect(amb)
        .createCollection(
          1,
          "WhiteSalt",
          "1155Whitelist",
          "WL",
          price,
          1000,
          "ipfs://cid/",
          ambSpl,
          750,
        );
      const wl = await ethers.getContractAt(
        "ERC1155Basic",
        wlAddr,
      );
      await erc20.mint(wl.address, price);
      await r1155.connect(amb).setMintState(wl.address, true);
      await wl.connect(acc01).mint(1, 1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const balc = await ethers.provider.getBalance(
        amb.address,
      );
      const bald = await erc20.balanceOf(amb.address);
      const txc = await r1155
        .connect(amb)
        .withdraw(wl.address, dead);
      const txd = await r1155
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

      await f1155
        .connect(await ethers.getSigner(newUser))
        .splitterCheck("MADSplitter4", dead, dead, 0, 0);
      const userSpl = await f1155.callStatic.getDeployedAddr(
        "MADSplitter4",
      );
      const lazyAddr = await f1155.callStatic.getDeployedAddr(
        "LazySalt",
      );
      await f1155
        .connect(await ethers.getSigner(newUser))
        .createCollection(
          1,
          "LazySalt",
          "1155Lazy",
          "LAZY",
          price,
          100,
          "ipfs://cid/",
          userSpl,
          750,
        );
      const lazy = await ethers.getContractAt(
        "ERC1155Basic",
        lazyAddr,
      );
      // const net = await lazy.provider.getNetwork();
      // const chainId = net.chainId;
      // const bnPrice = ethers.utils.parseEther("1");
      // const usrs = [acc01.address];
      // const vId = ethers.utils.keccak256(
      // ethers.utils.toUtf8Bytes("voucher"),
      // );
      // const signer = ethers.Wallet.createRandom();
      // const signerAddr = await signer.getAddress();
      // await r1155.setSigner(lazyAddr, signerAddr);
      // const pk = Buffer.from(
      // signer.privateKey.slice(2),
      // "hex",
      // );
      //
      // const domain = [
      // { name: "name", type: "string" },
      // { name: "version", type: "string" },
      // { name: "chainId", type: "uint256" },
      // { name: "verifyingContract", type: "address" },
      // ];
      // const voucherType = [
      // { name: "voucherId", type: "bytes32" },
      // { name: "users", type: "address[]" },
      // { name: "balances", type: "uint256[]" },
      // { name: "amount", type: "uint256" },
      // { name: "price", type: "uint256" },
      // ];
      // const domainData = {
      // name: "MAD",
      // version: "1",
      // chainId: chainId,
      // verifyingContract: lazy.address,
      // };
      // const Voucher = {
      // voucherId: vId,
      // users: usrs,
      // balances: [1],
      // amount: 1,
      // price: bnPrice.toString(),
      // };
      // const data = JSON.stringify({
      // types: {
      // EIP712Domain: domain,
      // Voucher: voucherType,
      // },
      // primaryType: "Voucher",
      // domain: domainData,
      // message: Voucher,
      // });
      //
      // const parsedData = JSON.parse(data);
      // const signature = signTypedData({
      // privateKey: pk,
      // data: parsedData,
      // version: SignTypedDataVersion.V4,
      // });
      // const sigSplit = ethers.utils.splitSignature(signature);
      // await erc20.mint(lazy.address, price);
      // await lazy
      // .connect(acc01)
      // .lazyMint(
      // Voucher,
      // sigSplit.v,
      // sigSplit.r,
      // sigSplit.s,
      // { value: price.add(ethers.utils.parseEther("0.25")) },
      // );
      await erc20.mint(lazy.address, price);
      await r1155
        .connect(await ethers.getSigner(newUser))
        .setMintState(lazy.address, true);
      await lazy.connect(acc01).mint(1, 1, {
        value: price.add(ethers.utils.parseEther("0.25")),
      });
      const bal3 = await ethers.provider.getBalance(newUser);
      const bal4 = await erc20.balanceOf(newUser);
      const tx3 = await r1155
        .connect(await ethers.getSigner(newUser))
        .withdraw(lazy.address, dead);
      const tx4 = await r1155
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
        f1155.address,
        verArt.abi,
        ethers.provider,
      );

      expect(tx1).to.be.ok;
      expect(tx2).to.be.ok;
      expect(bal1).to.be.lt(newBal1);
      expect(price.mul(8000).div(10_000)).to.be.eq(
        newBal2.sub(bal2),
      );

      await expect(
        r1155
          .connect(acc01)
          .withdraw(basic.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155
          .connect(acc02)
          .withdraw(basic.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r1155.connect(acc02).withdraw(basic.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(txa).to.be.ok;
      expect(txb).to.be.ok;
      expect(bala).to.be.below(newBala);
      expect(balb).to.be.below(newBalb);

      await expect(
        r1155
          .connect(acc01)
          .withdraw(basic2.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155
          .connect(mad)
          .withdraw(basic2.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r1155.connect(mad).withdraw(basic2.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(txc).to.be.ok;
      expect(txd).to.be.ok;
      expect(balc).to.be.lt(newBalc);
      expect(bald).to.be.lt(newBald);

      await expect(
        r1155
          .connect(acc01)
          .withdraw(wl.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155
          .connect(amb)
          .withdraw(wl.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r1155.connect(amb).withdraw(wl.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);

      expect(tx3).to.be.ok;
      expect(tx4).to.be.ok;
      expect(bal3).to.be.below(newBal3);
      expect(bal4).to.be.below(newBal4);

      await expect(
        r1155
          .connect(acc01)
          .withdraw(lazy.address, erc20.address),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
      await expect(
        r1155
          .connect(await ethers.getSigner(newUser))
          .withdraw(lazy.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r1155
          .connect(await ethers.getSigner(newUser))
          .withdraw(lazy.address, dead),
      ).to.be.revertedWith(RouterErrors.NoFunds);
    });
  });
  describe("Only Owner", async () => {
    it("Should update contract's owner", async () => {
      const tx = await r1155.setOwner(mad.address);

      expect(tx).to.be.ok;
      await expect(tx)
        .to.emit(r1155, "OwnerUpdated")
        .withArgs(owner.address, mad.address);
      expect(await r1155.callStatic.owner()).to.eq(
        mad.address,
      );
      await expect(
        r1155.connect(acc02).setOwner(acc01.address),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
    });
    it("Should initialize paused and unpaused states", async () => {
      const addr = await f1155.callStatic.getDeployedAddr(
        "salt",
      );
      const tx = await r1155.pause();
      expect(tx).to.be.ok;
      await expect(
        r1155.connect(acc01).pause(),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
      await expect(
        r1155.setBaseURI(addr, ""),
      ).to.be.revertedWith(RouterErrors.Paused);

      await expect(
        r1155.burn(
          addr,
          [1, 2, 3],
          [acc01.address, acc01.address, acc01.address],
          [1, 1, 1],
        ),
      ).to.be.revertedWith(RouterErrors.Paused);
      await expect(
        r1155.setMintState(addr, false),
      ).to.be.revertedWith(RouterErrors.Paused);

      await expect(
        r1155.connect(acc02).unpause(),
      ).to.be.revertedWith(RouterErrors.Unauthorized);
      expect(await r1155.unpause()).to.be.ok;
    });
  });

  describe("Basic MintTo", async () => {
    it("Should call basicMintTo for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const minAddr = await f1155.callStatic.getDeployedAddr(
        "MinSalt",
      );
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "MinSalt",
          "1155Min",
          "MIN",
          price,
          1,
          "cid/id.json",
          splAddr,
          750,
        );
      const min = await ethers.getContractAt(
        "ERC1155Basic",
        minAddr,
      );
      await r1155.setFees(
        ethers.utils.parseEther("2.5"),
        ethers.utils.parseEther("0.5"),
      );
      await expect(
        r1155
          .connect(acc02)
          .basicMintTo(minAddr, acc01.address, 1, [1], {
            value: ethers.utils.parseEther("0.25"),
          }),
      ).to.be.revertedWithCustomError(
        min,
        BasicErrors.WrongPrice,
      );

      const tx = await r1155
        .connect(acc02)
        .basicMintTo(minAddr, acc01.address, 1, [1], {
          value: ethers.utils.parseEther("2.5"),
        });

      expect(tx).to.be.ok;
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155
          .connect(mad)
          .basicMintTo(minAddr, acc02.address, 1, [1], {
            value: ethers.utils.parseEther("2.5"),
          }),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Basic BatchMintTo", async () => {
    it("Should call basicMintTo for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const minAddr = await f1155.callStatic.getDeployedAddr(
        "MinSalt",
      );
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "MinSalt",
          "1155Min",
          "MIN",
          price,
          2,
          "cid/id.json",
          splAddr,
          750,
        );
      const min = await ethers.getContractAt(
        "ERC1155Basic",
        minAddr,
      );
      await r1155.setFees(
        ethers.utils.parseEther("2.5"),
        ethers.utils.parseEther("0.5"),
      );
      await expect(
        r1155
          .connect(acc02)
          .basicMintBatchTo(
            minAddr,
            acc01.address,
            [1, 2],
            [1, 1],
            { value: ethers.utils.parseEther("0.25") },
          ),
      ).to.be.revertedWithCustomError(
        min,
        BasicErrors.WrongPrice,
      );

      const tx = await r1155
        .connect(acc02)
        .basicMintBatchTo(
          minAddr,
          acc01.address,
          [1, 2],
          [1, 1],
          { value: ethers.utils.parseEther("2.5") },
        );

      expect(tx).to.be.ok;
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155
          .connect(mad)
          .basicMintBatchTo(
            minAddr,
            acc02.address,
            [1, 2],
            [1, 1],
            { value: ethers.utils.parseEther("2.5") },
          ),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
  describe("Set Fee Set Max Tests", async () => {
    it("Should allow setting fees below and at the limit (2.5 eth and 0.5 eth for our fixtures)", async () => {
      await expect(
        r1155.setFees(
          ethers.utils.parseEther("2.4"),
          ethers.utils.parseEther("0.4"),
        ),
      ).to.be.ok;

      await expect(
        r1155.setFees(
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("0.5"),
        ),
      ).to.be.ok;

      await expect(
        r1155.setFees(
          ethers.utils.parseEther("2.6"),
          ethers.utils.parseEther("0.6"),
        ),
      ).to.be.reverted;
    });
  }),
    describe("Burn-setfees", async () => {
      it("Should burn tokens for 1155Basic collection type", async () => {
        await f1155
          .connect(acc02)
          .splitterCheck(
            "MADSplitter1",
            amb.address,
            dead,
            20,
            0,
          );
        const splAddr =
          await f1155.callStatic.getDeployedAddr(
            "MADSplitter1",
          );
        const basicAddr =
          await f1155.callStatic.getDeployedAddr("BasicSalt");
        await f1155
          .connect(acc02)
          .createCollection(
            1,
            "BasicSalt",
            "1155Basic",
            "BASIC",
            price,
            1000,
            "ipfs://cid/",
            splAddr,
            750,
          );
        const basic = await ethers.getContractAt(
          "ERC1155Basic",
          basicAddr,
        );
        await r1155
          .connect(acc02)
          .setMintState(basicAddr, true);

        await r1155.setFees(
          ethers.utils.parseEther("2.5"),
          ethers.utils.parseEther("0.5"),
        );

        await basic.connect(acc01).mint(1, 1, {
          value: price.add(ethers.utils.parseEther("2.5")),
        });

        await expect(
          r1155
            .connect(acc02)
            .burn(basicAddr, [1], [acc01.address], [1]),
        ).to.be.revertedWithCustomError(
          basic,
          BasicErrors.WrongPrice,
        );

        const tx = await r1155
          .connect(acc02)
          .burn(basicAddr, [1], [acc01.address], [1], {
            value: ethers.utils.parseEther("0.5"),
          });

        expect(tx).to.be.ok;
        expect(
          await basic.callStatic.balanceOf(acc01.address, 1),
        ).to.eq(0);
        const verArt = await artifacts.readArtifact(
          "FactoryVerifier",
        );
        const ver = new ethers.Contract(
          f1155.address,
          verArt.abi,
          ethers.provider,
        );
        await expect(
          r1155.burn(basicAddr, [1], [acc01.address], [1], {
            value: ethers.utils.parseEther("0.5"),
          }),
        ).to.be.revertedWithCustomError(
          ver,
          RouterErrors.AccessDenied,
        );
      });
    });
  describe("Batch Burn", async () => {
    it("Should batch burn token for 1155Basic collection type", async () => {
      await f1155
        .connect(acc02)
        .splitterCheck(
          "MADSplitter1",
          amb.address,
          dead,
          20,
          0,
        );
      const splAddr = await f1155.callStatic.getDeployedAddr(
        "MADSplitter1",
      );
      const basicAddr =
        await f1155.callStatic.getDeployedAddr("BasicSalt");
      await f1155
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "1155Basic",
          "BASIC",
          price,
          1000,
          "ipfs://cid/",
          splAddr,
          750,
        );
      const pmul = await ethers.BigNumber.from(4);
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await r1155
        .connect(acc02)
        .setMintState(basicAddr, true);
      await basic.connect(acc01).mint(4, 1, {
        value: price
          .mul(pmul)
          .add(ethers.utils.parseEther("0.25")),
      });

      await r1155.setFees(
        ethers.utils.parseEther("2.5"),
        ethers.utils.parseEther("0.5"),
      );

      await expect(
        r1155
          .connect(acc02)
          .batchBurn(
            basicAddr,
            acc01.address,
            [1, 2, 3, 4],
            [1, 1, 1, 1],
          ),
      ).to.be.revertedWithCustomError(
        basic,
        BasicErrors.WrongPrice,
      );

      const tx = await r1155
        .connect(acc02)
        .batchBurn(
          basicAddr,
          acc01.address,
          [1, 2, 3, 4],
          [1, 1, 1, 1],
          { value: ethers.utils.parseEther("0.5") },
        );

      expect(tx).to.be.ok;
      expect(
        await basic.callStatic.balanceOf(acc01.address, 1),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 2),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 3),
      ).to.eq(0);
      expect(
        await basic.callStatic.balanceOf(acc01.address, 4),
      ).to.eq(0);
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await expect(
        r1155.batchBurn(basicAddr, acc01.address, [1], [1], {
          value: ethers.utils.parseEther("0.5"),
        }),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
});
