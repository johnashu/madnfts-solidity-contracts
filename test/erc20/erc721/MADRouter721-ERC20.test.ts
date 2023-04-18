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
} from "../../../src/types";
import {
  BasicErrors,
  RouterErrors,
} from "./../../utils/errors";
import {
  dead,
  madFixture721E,
} from "./../../utils/madFixtures";

describe("MADRouter721 - ERC20", () => {
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
    ({ f721, m721, r721, erc20 } = await loadFixture(
      madFixture721E,
    ));
    await r721.deployed();
    await m721.deployed();
    await f721.deployed();
    await erc20.transfer(acc01.address, erc20Balance);
    await erc20.transfer(acc02.address, erc20Balance);
    await erc20.transfer(amb.address, erc20Balance);
    await erc20.transfer(mad.address, erc20Balance);
  });

  describe("Init", async () => {
    it("Router should initialize with ERC20", async () => {
      expect(r721).to.be.ok;

      // check each global var
      expect(await r721.callStatic.name()).to.eq("router");
      expect(await r721.madFactory()).to.eq(f721.address);
      expect(await f721.callStatic.erc20()).to.eq(
        erc20.address,
      );
      expect(await m721.callStatic.erc20()).to.eq(
        erc20.address,
      );
    });
  });
  describe("Set baseURI", async () => {
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
      const minAddr = await f721.callStatic.getDeployedAddr(
        "BasicSalt",
      );
      await f721
        .connect(acc02)
        .createCollection(
          1,
          "BasicSalt",
          "721Minimal",
          "MIN",
          price,
          1,
          "cid/id.json",
          splAddr,
          750,
        );
      const basic = await ethers.getContractAt(
        "ERC721Basic",
        minAddr,
      );

      await erc20
        .connect(acc02)
        .approve(
          r721.address,
          ethers.utils.parseEther("0.25"),
        );
      const tx = await r721
        .connect(acc02)
        .basicMintTo(minAddr, acc01.address, 1);

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
          .basicMintTo(minAddr, acc02.address, 1),
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

      await erc20
        .connect(acc01)
        .approve(
          basicAddr,
          price.add(ethers.utils.parseEther("0.25")),
        );
      await basic.connect(acc01).mint(1);
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

    describe("Creator Withdraw", async () => {
      it("Should withdraw balance and ERC20 for all colTypes", async () => {
        const basicAddr =
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
        const basic = await ethers.getContractAt(
          "ERC721Basic",
          basicAddr,
        );

        await r721
          .connect(mad)
          .setMintState(basic.address, true);

        await erc20
          .connect(acc01)
          .approve(
            basic.address,
            price.add(ethers.utils.parseEther("0.25")),
          );
        await basic.connect(acc01).mint(1);

        const bal2 = await erc20.balanceOf(mad.address);
        const tx2 = await r721
          .connect(mad)
          .withdraw(basic.address, erc20.address);
        const newBal2 = await erc20.balanceOf(mad.address);

        const verArt = await artifacts.readArtifact(
          "FactoryVerifier",
        );
        const ver = new ethers.Contract(
          f721.address,
          verArt.abi,
          ethers.provider,
        );

        expect(tx2).to.be.ok;
        // we no longer take 10% of platform fees

        expect(price.mul(8000).div(10_000)).to.be.eq(
          newBal2.sub(bal2),
        );

        expect(tx2).to.be.ok;

        expect(bal2).to.be.below(newBal2);

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
            .connect(mad)
            .withdraw(basic.address, erc20.address),
        ).to.be.revertedWith(RouterErrors.NoFunds);
        await expect(
          r721.connect(mad).withdraw(basic.address, dead),
        ).to.be.revertedWith(RouterErrors.NoFunds);
      });
      it("Should withdraw ERC20 and distribute public mint fees for all colTypes", async () => {
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

        // Deploy BASIC contracts and set public mint = true
        const basicAddr =
          await f721.callStatic.getDeployedAddr("salt");
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
            1000,
          );
        const basic = await ethers.getContractAt(
          "ERC721Basic",
          basicAddr,
        );
        await r721
          .connect(mad)
          .setMintState(basic.address, true);

        // Record ERC20 start balances
        const startBalMad = await erc20.balanceOf(
          mad.address,
        );
        const startBalAmb = await erc20.balanceOf(
          amb.address,
        );
        const startBalRecipient = await erc20.balanceOf(
          recipient,
        );
        const startBalAcc01 = await erc20.balanceOf(
          acc01.address,
        );

        // Mint a public token with ERC20 - fee 2.5 + price 1
        await erc20
          .connect(acc01)
          .approve(
            basic.address,
            price.add(ethers.utils.parseEther("2.5")),
          );
        await basic.connect(acc01).mint(1);
        await r721
          .connect(mad)
          .withdraw(basic.address, erc20.address);

        // Record end balances
        const endBalMad = await erc20.balanceOf(mad.address);
        const endBalAmb = await erc20.balanceOf(amb.address);
        const endBalRecipient = await erc20.balanceOf(
          recipient,
        );
        const endBalAcc01 = await erc20.balanceOf(
          acc01.address,
        );

        // mad.address = creator = - txWithdrawGas + 80% of price (remaining 20% goes to ambassador)
        expect(endBalMad).to.eq(
          startBalMad.add(ethers.utils.parseEther("0.8")),
        );
        // amb.address = ambassador = + 20% of price (remaining 80% goes to creator)
        expect(endBalAmb).to.eq(
          startBalAmb.add(ethers.utils.parseEther("0.2")),
        );
        // owner.address = MAD receiver = + 100% mint fees
        expect(endBalRecipient).to.eq(
          startBalRecipient.add(
            ethers.utils.parseEther("2.5"),
          ),
        );
        // acc01.address = buyer = - price - fee - txFees
        expect(endBalAcc01).to.eq(
          startBalAcc01.sub(ethers.utils.parseEther("3.5")),
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
        await expect(
          r721.setBase(addr, ""),
        ).to.be.revertedWith(RouterErrors.Paused);

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
        await erc20
          .connect(acc02)
          .approve(
            r721.address,
            ethers.utils.parseEther("2.5"),
          );
        await r721
          .connect(acc02)
          .setMintState(basicAddr, true);

        await erc20
          .connect(acc01)
          .approve(
            basic.address,
            price.add(ethers.utils.parseEther("2.5")),
          );
        await basic.connect(acc01).mint(1);

        await expect(
          r721.connect(acc02).burn(basicAddr, [1]),
        ).to.be.revertedWithCustomError(
          basic,
          BasicErrors.WrongPrice,
        );

        await erc20
          .connect(acc02)
          .approve(
            r721.address,
            ethers.utils.parseEther("0.5"),
          );
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
        await erc20
          .connect(acc02)
          .approve(
            r721.address,
            ethers.utils.parseEther("0.2"),
          );
        await expect(
          r721.burn(basicAddr, [1]),
        ).to.be.revertedWithCustomError(
          ver,
          RouterErrors.AccessDenied,
        );
      });
    });
  });
});
