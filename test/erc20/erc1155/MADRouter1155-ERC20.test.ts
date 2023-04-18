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
} from "../../../src/types";
import {
  BasicErrors,
  RouterErrors,
} from "../../utils/errors";
import {
  dead,
  madFixture1155E,
} from "../../utils/madFixtures";

describe("MADRouter1155 - ERC20", () => {
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
  let erc20: MockERC20;

  const erc20Balance: BigNumber =
    ethers.utils.parseEther("500");
  const price: BigNumber = ethers.utils.parseEther("1");

  before("Set signers and reset network", async () => {
    [owner, amb, mad, acc01, acc02] =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ethers as any).getSigners();

    await network.provider.send("hardhat_reset");
  });
  beforeEach("Load deployment fixtures", async () => {
    ({ f1155, m1155, r1155, erc20 } = await loadFixture(
      madFixture1155E,
    ));
    await r1155.deployed();
    await m1155.deployed();
    await f1155.deployed();
    await erc20.transfer(acc01.address, erc20Balance);
    await erc20.transfer(acc02.address, erc20Balance);
    await erc20.transfer(amb.address, erc20Balance);
    await erc20.transfer(mad.address, erc20Balance);
  });

  describe("Init", async () => {
    it("Router should initialize", async () => {
      expect(r1155).to.be.ok;

      // check each global var
      expect(await r1155.callStatic.name()).to.eq("router");
      expect(await r1155.madFactory()).to.eq(f1155.address);
      expect(await r1155.callStatic.erc20()).to.eq(
        erc20.address,
      );
      expect(await f1155.callStatic.erc20()).to.eq(
        erc20.address,
      );
    });
  });
  describe("Set URI", async () => {
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

      await erc20
        .connect(acc01)
        .approve(
          basic.address,
          price.add(ethers.utils.parseEther("0.25")),
        );
      await basic.connect(acc01).mint(1, 1);
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

      await erc20
        .connect(acc01)
        .approve(
          basicAddr,
          price
            .mul(pmul)
            .add(ethers.utils.parseEther("0.25")),
        );
      await basic.connect(acc01).mint(4, 1);
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

      const tx2 = await r1155
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
    });
  });

  describe("Creator Withdraw", async () => {
    it("Should withdraw balance and ERC20 for all colTypes", async () => {
      const basicAddr =
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
      const basic = await ethers.getContractAt(
        "ERC1155Basic",
        basicAddr,
      );
      await erc20.mint(basic.address, price);
      await r1155
        .connect(mad)
        .setMintState(basic.address, true);
      await erc20
        .connect(acc01)
        .approve(
          basic.address,
          price.add(ethers.utils.parseEther("0.25")),
        );
      await basic.connect(acc01).mint(1, 1);
      const bal2 = await erc20.balanceOf(mad.address);
      const tx2 = await r1155
        .connect(mad)
        .withdraw(basic.address, erc20.address);
      const newBal2 = await erc20.balanceOf(mad.address);

      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );

      expect(tx2).to.be.ok;
      expect(price.mul(16000).div(10_000)).to.be.eq(
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
          .connect(mad)
          .withdraw(basic.address, erc20.address),
      ).to.be.revertedWith(RouterErrors.NoFunds);
      await expect(
        r1155.connect(mad).withdraw(basic.address, dead),
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

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("0.25"),
        );
      await expect(
        r1155
          .connect(acc02)
          .basicMintTo(minAddr, acc01.address, 1, [1]),
      ).to.be.revertedWithCustomError(
        min,
        BasicErrors.WrongPrice,
      );

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("2.5"),
        );
      const tx = await r1155
        .connect(acc02)
        .basicMintTo(minAddr, acc01.address, 1, [1]);

      expect(tx).to.be.ok;
      const verArt = await artifacts.readArtifact(
        "FactoryVerifier",
      );
      const ver = new ethers.Contract(
        f1155.address,
        verArt.abi,
        ethers.provider,
      );
      await erc20
        .connect(mad)
        .approve(
          r1155.address,
          ethers.utils.parseEther("2.5"),
        );
      await expect(
        r1155
          .connect(mad)
          .basicMintTo(minAddr, acc02.address, 1, [1]),
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
      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("0.25"),
        );
      await expect(
        r1155
          .connect(acc02)
          .basicMintBatchTo(
            minAddr,
            acc01.address,
            [1, 2],
            [1, 1],
          ),
      ).to.be.revertedWithCustomError(
        min,
        BasicErrors.WrongPrice,
      );

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("2.5"),
        );
      const tx = await r1155
        .connect(acc02)
        .basicMintBatchTo(
          minAddr,
          acc01.address,
          [1, 2],
          [1, 1],
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
      await erc20
        .connect(mad)
        .approve(
          r1155.address,
          ethers.utils.parseEther("2.5"),
        );
      await expect(
        r1155
          .connect(mad)
          .basicMintBatchTo(
            minAddr,
            acc02.address,
            [1, 2],
            [1, 1],
          ),
      ).to.be.revertedWithCustomError(
        ver,
        RouterErrors.AccessDenied,
      );
    });
  });
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

      await r1155.setFees(
        ethers.utils.parseEther("2.5"),
        ethers.utils.parseEther("0.5"),
      );

      await erc20
        .connect(acc01)
        .approve(
          basic.address,
          price.add(ethers.utils.parseEther("2.5")),
        );
      await basic.connect(acc01).mint(1, 1);

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("0.56"),
        );
      await expect(
        r1155
          .connect(acc02)
          .burn(basicAddr, [1], [acc01.address], [1]),
      ).to.be.revertedWithCustomError(
        basic,
        BasicErrors.WrongPrice,
      );

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("0.5"),
        );
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
      await erc20
        .connect(acc01)
        .approve(
          basic.address,
          price
            .mul(pmul)
            .add(ethers.utils.parseEther("0.25")),
        );
      await basic.connect(acc01).mint(4, 1);

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

      await erc20
        .connect(acc02)
        .approve(
          r1155.address,
          ethers.utils.parseEther("0.5"),
        );
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
});
