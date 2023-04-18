// import "@nomicfoundation/hardhat-chai-matchers";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
// import { BigNumber, Wallet } from "ethers";
// import { ethers, network } from "hardhat";

// import {
//   ERC1155Whitelist,
//   MockERC20,
//   SplitterImpl,
// } from "../../src/types";
// import { dead } from "../utils/madFixtures";
// import { WhitelistErrors } from "./../utils/errors";
// import {
//   getSignerAddrs, // erc20Fixture,
//   whitelistFixture1155,
// } from "./../utils/fixtures";
// import {
//   ERC165Interface,
//   ERC1155Interface,
//   ERC1155MetadataInterface,
//   ERC2981Interface,
//   getInterfaceID,
// } from "./../utils/interfaces";

// describe("ERC1155Whitelist", () => {
//   /*
//   For the sake of solely testing the nft functionalities, we consider
//   the user as the contract's owner, and the marketplace just as the
//   recipient for the royalties distribution; even though these tx
//   would've been proxied through the marketplace address when the
//   other core contracts are taken into account.
//   */

//   type WalletWithAddress = Wallet & SignerWithAddress;

//   // contract deployer/admin
//   let owner: WalletWithAddress;

//   // ambassador
//   let amb: WalletWithAddress;

//   // marketplace address
//   let mad: WalletWithAddress;

//   // extra EOAs
//   let acc01: WalletWithAddress;
//   let acc02: WalletWithAddress;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   let res: any;

//   let splitter: SplitterImpl;
//   let wl: ERC1155Whitelist;
//   // let erc20: MockERC20;
//   let merkleRoot: string;
//   let proof: string[];
//   let wrongProof: string[];

//   const fundAmount: BigNumber =
//     ethers.utils.parseEther("10000");
//   const price: BigNumber = ethers.utils.parseEther("1");

//   before("Set signers and reset network", async () => {
//     [owner, amb, mad, acc01, acc02] =
//       await // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (ethers as any).getSigners();

//     await network.provider.send("hardhat_reset");
//   });
//   beforeEach("Load deployment fixtures", async () => {
//     ({ wl, splitter, proof, wrongProof, merkleRoot } =
//       await loadFixture(whitelistFixture1155));
//   });

//   describe("Init", async () => {
//     it("Splitter and ERC1155 should initialize", async () => {
//       await wl.deployed();
//       await splitter.deployed();
//       expect(wl).to.be.ok;
//       expect(splitter).to.be.ok;

//       // check each global var including wl/free config settings
//       await expect(await wl.deployTransaction)
//         .to.emit(wl, "RoyaltyFeeSet")
//         .withArgs(750)
//         .and.to.emit(wl, "RoyaltyRecipientSet")
//         .withArgs(splitter.address);

//       //public mint settings
//       expect(await wl.callStatic.publicPrice()).to.eq(price);
//       expect(await wl.callStatic.maxSupply()).to.eq(1000);
//       expect(await wl.callStatic.publicMintState()).to.eq(
//         false,
//       );

//       // splitter settings
//       expect(await wl.callStatic.splitter()).to.eq(
//         splitter.address,
//       );
//       expect(await splitter.callStatic.totalShares()).to.eq(
//         100,
//       );
//       expect(await splitter.callStatic._payees(0)).to.eq(
//         mad.address,
//       );
//       expect(await splitter.callStatic._payees(1)).to.eq(
//         amb.address,
//       );
//       expect(await splitter.callStatic._payees(2)).to.eq(
//         owner.address,
//       );

//       // whitelist settings
//       expect(await wl.callStatic.whitelistPrice()).to.eq(
//         price,
//       );
//       expect(await wl.callStatic.maxWhitelistSupply()).to.eq(
//         100,
//       );
//       expect(await wl.callStatic.whitelistMerkleRoot()).to.eq(
//         merkleRoot,
//       );
//       expect(await wl.callStatic.whitelistMintState()).to.eq(
//         false,
//       );

//       // free claim settings
//       expect(await wl.callStatic.maxFree()).to.eq(10);
//       expect(await wl.callStatic.freeSupply()).to.eq(0);
//       expect(await wl.callStatic.claimListMerkleRoot()).to.eq(
//         merkleRoot,
//       );
//       expect(await wl.callStatic.freeClaimState()).to.eq(
//         false,
//       );
//       expect(await wl.callStatic.freeAmount()).to.eq(1);
//     });

//     it("accounts have been funded", async () => {
//       // can't be eq to ethAmount due to contract deployment cost
//       res = await ethers.provider.getBalance(owner.address);
//       expect(res.toString()).to.have.lengthOf(22);
//       // console.log(res); // lengthOf = 22
//       // console.log(ethAmount); // lengthOf = 23

//       // those should eq to hardhat prefunded account's value
//       expect(
//         await ethers.provider.getBalance(amb.address),
//       ).to.eq(fundAmount);
//       expect(
//         await ethers.provider.getBalance(mad.address),
//       ).to.eq(fundAmount);
//       expect(
//         await ethers.provider.getBalance(acc01.address),
//       ).to.eq(fundAmount);
//       expect(
//         await ethers.provider.getBalance(acc02.address),
//       ).to.eq(fundAmount);
//     });
//   });

//   // freeclaim and whitelist config setters already
//   // tested for storage updating in `Init` describe
//   describe("Only owner setters", async () => {
//     it("Should check for whitelist & freeclaim event emitting/error handling", async () => {
//       const tx1 = await wl.whitelistConfig(
//         price,
//         100,
//         merkleRoot,
//       );
//       const tx2 = await wl.freeConfig(1, 10, merkleRoot);

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       await expect(tx1)
//         .to.emit(wl, "WhitelistConfigSet")
//         .withArgs(price, 100, merkleRoot);
//       await expect(tx2)
//         .to.emit(wl, "FreeConfigSet")
//         .withArgs(1, 10, merkleRoot);
//       await expect(
//         wl
//           .connect(acc02)
//           .whitelistConfig(price, 100, merkleRoot),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.connect(acc01).freeConfig(1, 10, merkleRoot),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//     });

//     it("Should set URI and emit event", async () => {
//       const res = "";
//       const tx = await wl.setURI(res);
//       const fail = wl.connect(acc02).setURI(res);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "BaseURISet")
//         .withArgs(res);
//       await expect(fail).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//     });
//     it("Should set mint states", async () => {
//       const tx1 = await wl.setPublicMintState(true);
//       const tx2 = await wl.setWhitelistMintState(true);
//       const tx3 = await wl.setFreeClaimState(true);

//       const fail1 = wl
//         .connect(acc01)
//         .setPublicMintState(false);
//       const fail2 = wl
//         .connect(acc01)
//         .setWhitelistMintState(false);
//       const fail3 = wl
//         .connect(acc01)
//         .setFreeClaimState(false);

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       expect(tx3).to.be.ok;

//       await expect(fail1).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//       await expect(fail2).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//       await expect(fail3).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//     });
//   });
//   describe("Public mint", async () => {
//     it("Should revert if value under/overflows", async () => {
//       const one = ethers.constants.One;
//       const over = ethers.constants.MaxUint256.add(one);
//       await wl.setPublicMintState(true);
//       const tx = wl.mint(
//         ethers.constants.NegativeOne,
//         [1],
//         1,
//       );
//       const tx2 = wl.mint(over, [1], 1);

//       await expect(tx).to.be.revertedWithoutReason;
//       await expect(tx2).to.be.revertedWithoutReason;
//     });
//     it("Should revert if public mint state is off", async () => {
//       const tx = wl
//         .connect(acc02)
//         .mint(1, [1], 1, { value: price });

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.PublicMintClosed,
//       );
//     });
//     it("Should revert if available supply has reached max", async () => {
//       //  liveSupply.current() + amount > maxSupply - maxFree
//       const amount = ethers.BigNumber.from(890);
//       await wl.setPublicMintState(true);
//       // total avaiable should eq to:
//       // 1000(totalsupply) - 100(whitelist) - 10(freeclaim)
//       await wl.connect(acc01).mint(
//         890,
//         Array.from(Array(890).keys()).map(_e => 1),
//         890,
//         { value: price.mul(amount) },
//       );
//       const tx = wl
//         .connect(acc02)
//         .mint(1, [1], 1, { value: price });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxMintReached,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setPublicMintState(true);
//       const tx = wl.connect(acc02).mint(1, [1], 1);

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(2);
//       const dead = ethers.constants.AddressZero;
//       const balA1 = wl.callStatic.balanceOf(acc01.address, 1);
//       const balB1 = wl.callStatic.balanceOf(acc01.address, 2);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(acc01)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       const sup2 = wl.callStatic.totalSupply();
//       const balA2 = wl.callStatic.balanceOf(acc01.address, 1);
//       const balB2 = wl.callStatic.balanceOf(acc01.address, 2);
//       // const ownerOfA = wl.callStatic.ownerOf(1);
//       // const ownerOfB = wl.callStatic.ownerOf(2);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(acc01.address, dead, acc01.address, 1, 1);
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(acc01.address, dead, acc01.address, 2, 1);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(2);
//       expect(await balA1).to.eq(0);
//       expect(await balA2).to.eq(1);
//       expect(await balB1).to.eq(0);
//       expect(await balB2).to.eq(1);
//       // expect(await ownerOfA).to.eq(acc01.address);
//       // expect(await ownerOfB).to.eq(acc01.address);

//       // await expect(await wl.connect(owner).ownerOf(3)).to.eq(
//       //   dead,
//       // );
//     });
//   });
//   describe("Batch mint", async () => {
//     it("Should revert if supply has reached max", async () => {
//       await wl.setPublicMintState(true);
//       const id = [24];
//       const amount = ethers.BigNumber.from(890);
//       await wl.mint(
//         890,
//         Array.from(Array(890).keys()).map(_e => 1),
//         890,
//         { value: price.mul(amount) },
//       );
//       const tx = wl
//         .connect(mad)
//         .mintBatch(id, [1], { value: price });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxMintReached,
//       );
//     });
//     it("Should revert if public mint is turned off", async () => {
//       const id = [25];
//       const tx = wl
//         .connect(acc01)
//         .mint(id, [1], 1, { value: price });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.PublicMintClosed,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(4);
//       const ids = [23, 13, 400];
//       const tx = wl.mintBatch(ids, [1, 1, 1], {
//         value: price.mul(amount),
//       });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should batch mint, update storage and emit events", async () => {
//       await wl.setPublicMintState(true);
//       const dead = ethers.constants.AddressZero;
//       const amount = ethers.BigNumber.from(3);
//       const one = ethers.constants.One;
//       const zero = ethers.constants.Zero;
//       const ids = [123, 14, 500];
//       const amounts = [one, one, one];
//       const tx = await wl
//         .connect(acc02)
//         .mintBatch(ids, [1, 1, 1], {
//           value: price.mul(amount),
//         });
//       // const ownerOfNull = await wl.callStatic.ownerOf(1);
//       // const ownerOfA = await wl.callStatic.ownerOf(123);
//       // const ownerOfB = await wl.callStatic.ownerOf(14);
//       // const ownerOfC = await wl.callStatic.ownerOf(500);
//       const balNull = await wl.callStatic.balanceOf(
//         acc02.address,
//         1,
//       );
//       const balA = await wl.callStatic.balanceOf(
//         acc02.address,
//         123,
//       );
//       const balB = await wl.callStatic.balanceOf(
//         acc02.address,
//         14,
//       );
//       const balC = await wl.callStatic.balanceOf(
//         acc02.address,
//         500,
//       );

//       expect(tx).to.be.ok;
//       expect(zero).to.eq(balNull);
//       expect(one).to.eq(balA);
//       expect(one).to.eq(balB);
//       expect(one).to.eq(balC);
//       // expect(dead).to.eq(ownerOfNull);
//       // expect(acc02.address).to.eq(ownerOfA);
//       // expect(acc02.address).to.eq(ownerOfB);
//       // expect(acc02.address).to.eq(ownerOfC);
//       await expect(tx)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           acc02.address,
//           dead,
//           acc02.address,
//           ids,
//           amounts,
//         );
//     });
//     it("Should handle multiple batch mints", async () => {
//       await wl.setPublicMintState(true);
//       const dead = ethers.constants.AddressZero;
//       const amount = ethers.BigNumber.from(3);
//       const one = ethers.constants.One;
//       const zero = ethers.constants.Zero;
//       const ids1 = [123, 14, 500];
//       const ids2 = [566, 145, 1000];
//       const ids3 = [1, 33, 7];
//       const amounts = [one, one, one];
//       const tx1 = await wl
//         .connect(acc02)
//         .mintBatch(ids1, [1, 1, 1], {
//           value: price.mul(amount),
//         });
//       const tx2 = await wl
//         .connect(owner)
//         .mintBatch(ids2, [1, 1, 1], {
//           value: price.mul(amount),
//         });
//       const tx3 = await wl
//         .connect(amb)
//         .mintBatch(ids3, [1, 1, 1], {
//           value: price.mul(amount),
//         });
//       // const ownerOfNull = await wl.callStatic.ownerOf(0);
//       // const ownerOfA = await wl.callStatic.ownerOf(ids1[0]);
//       // const ownerOfB = await wl.callStatic.ownerOf(ids2[1]);
//       // const ownerOfC = await wl.callStatic.ownerOf(ids3[2]);
//       const balNull = await wl.callStatic.balanceOf(
//         acc02.address,
//         0,
//       );
//       const balA = await wl.callStatic.balanceOf(
//         acc02.address,
//         ids1[2],
//       );
//       const balB = await wl.callStatic.balanceOf(
//         owner.address,
//         ids2[2],
//       );
//       const balC = await wl.callStatic.balanceOf(
//         amb.address,
//         ids3[0],
//       );

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       expect(tx3).to.be.ok;
//       expect(zero).to.eq(balNull);
//       expect(one).to.eq(balA);
//       expect(one).to.eq(balB);
//       expect(one).to.eq(balC);
//       // expect(dead).to.eq(ownerOfNull);
//       // expect(acc02.address).to.eq(ownerOfA);
//       // expect(owner.address).to.eq(ownerOfB);
//       // expect(amb.address).to.eq(ownerOfC);
//       await expect(tx1)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           acc02.address,
//           dead,
//           acc02.address,
//           ids1,
//           amounts,
//         );
//       await expect(tx2)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           dead,
//           owner.address,
//           ids2,
//           amounts,
//         );
//       await expect(tx3)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           amb.address,
//           dead,
//           amb.address,
//           ids3,
//           amounts,
//         );
//     });
//   });
//   describe("Whitelist mint", async () => {
//     it("Should revert if value under/overflows", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl.whitelistMint(
//         ethers.constants.NegativeOne,
//         [1],
//         1,
//         proof,
//       );
//       const tx2 = wl.whitelistMint(
//         256,
//         Array.from(Array(256).keys()).map(_e => 1),
//         256,
//         proof,
//       );

//       await expect(tx).to.be.revertedWithoutReason;
//       await expect(tx2).to.be.revertedWithoutReason;
//     });
//     it("Should revert if whitelist mint state is off", async () => {
//       const tx = wl.whitelistMint(1, [1], 1, proof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WhitelistMintClosed,
//       );
//     });
//     it("Should revert if whitelist supply has reached max", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(890);
//       await wl.connect(acc01).mint(
//         890,
//         Array.from(Array(890).keys()).map(_e => 1),
//         890,
//         { value: price.mul(amount) },
//       );
//       await wl.setWhitelistMintState(true);
//       const amount2 = ethers.BigNumber.from(100);
//       await wl.connect(owner).whitelistMint(
//         100,
//         Array.from(Array(100).keys()).map(_e => 1),
//         100,
//         proof,
//         {
//           value: price.mul(amount2),
//         },
//       );
//       const tx = wl
//         .connect(owner)
//         .whitelistMint(1, [1], 1, proof, { value: price });

//       expect(await wl.callStatic.totalSupply()).to.eq(990);
//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxWhitelistReached,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl
//         .connect(owner)
//         .whitelistMint(1, [1], 1, proof);

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should revert if address is not whitelisted", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl
//         .connect(acc01)
//         .whitelistMint(1, [1], 1, wrongProof, {
//           value: price,
//         });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AddressDenied,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       await wl.setWhitelistMintState(true);
//       const amount = ethers.BigNumber.from(2);
//       const dead = ethers.constants.AddressZero;
//       const balA1 = wl.callStatic.balanceOf(owner.address, 1);
//       const balB1 = wl.callStatic.balanceOf(owner.address, 2);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(owner)
//         .whitelistMint(2, [1, 1], 2, proof, {
//           value: price.mul(amount),
//         });
//       const sup2 = wl.callStatic.totalSupply();
//       const balA2 = wl.callStatic.balanceOf(owner.address, 1);
//       const balB2 = wl.callStatic.balanceOf(owner.address, 2);
//       // const ownerOfA = wl.callStatic.ownerOf(1);
//       // const ownerOfB = wl.callStatic.ownerOf(2);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, dead, owner.address, 1, 1);
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, dead, owner.address, 2, 1);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(2);
//       expect(await balA1).to.eq(0);
//       expect(await balA2).to.eq(1);
//       expect(await balB1).to.eq(0);
//       expect(await balB2).to.eq(1);
//       // expect(await ownerOfA).to.eq(owner.address);
//       // expect(await ownerOfB).to.eq(owner.address);
//       expect(await wl.callStatic.whitelistMinted()).to.eq(2);

//       // await expect(await wl.connect(owner).ownerOf(3)).to.eq(
//       //   dead,
//       // );
//     });
//   });
//   describe("Whitelist batch mint", async () => {
//     it("Should revert if value under/overflows", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl.whitelistMintBatch(
//         [ethers.constants.NegativeOne],
//         [1],
//         proof,
//       );
//       const tx2 = wl.whitelistMintBatch(
//         [ethers.constants.MaxUint256],
//         [1],
//         proof,
//       );

//       await expect(tx).to.be.revertedWithoutReason;
//       await expect(tx2).to.be.revertedWithoutReason;
//     });
//     it("Should revert if whitelist mint state is off", async () => {
//       const tx = wl.whitelistMintBatch([1], [1], proof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WhitelistMintClosed,
//       );
//     });
//     it("Should revert if whitelist supply has reached max", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(890);
//       await wl.connect(acc01).mint(
//         890,
//         Array.from(Array(890).keys()).map(_e => 1),
//         890,
//         { value: price.mul(amount) },
//       );
//       await wl.setWhitelistMintState(true);
//       const amount2 = ethers.BigNumber.from(100);
//       await wl.connect(owner).whitelistMint(
//         100,
//         Array.from(Array(100).keys()).map(_e => 1),
//         100,
//         proof,
//         {
//           value: price.mul(amount2),
//         },
//       );
//       const tx = wl
//         .connect(owner)
//         .whitelistMintBatch([1], [1], proof, {
//           value: price,
//         });

//       expect(await wl.callStatic.totalSupply()).to.eq(990);
//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxWhitelistReached,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl
//         .connect(owner)
//         .whitelistMintBatch([1], [1], proof);

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should revert if address is not whitelisted", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl
//         .connect(acc01)
//         .whitelistMintBatch([1], [1], wrongProof, {
//           value: price,
//         });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AddressDenied,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       await wl.setWhitelistMintState(true);
//       const amount = ethers.BigNumber.from(2);
//       const one = ethers.constants.One;
//       const ids = [1, 2];
//       const amounts = [one, one];
//       const dead = ethers.constants.AddressZero;
//       const balA1 = wl.callStatic.balanceOf(owner.address, 1);
//       const balB1 = wl.callStatic.balanceOf(owner.address, 2);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(owner)
//         .whitelistMintBatch(ids, [1, 1], proof, {
//           value: price.mul(amount),
//         });
//       const sup2 = wl.callStatic.totalSupply();
//       const balA2 = wl.callStatic.balanceOf(owner.address, 1);
//       const balB2 = wl.callStatic.balanceOf(owner.address, 2);
//       // const ownerOfA = wl.callStatic.ownerOf(1);
//       // const ownerOfB = wl.callStatic.ownerOf(2);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           dead,
//           owner.address,
//           ids,
//           amounts,
//         );
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(2);
//       expect(await balA1).to.eq(0);
//       expect(await balA2).to.eq(1);
//       expect(await balB1).to.eq(0);
//       expect(await balB2).to.eq(1);
//       // expect(await ownerOfA).to.eq(owner.address);
//       // expect(await ownerOfB).to.eq(owner.address);
//       expect(await wl.callStatic.whitelistMinted()).to.eq(2);

//       // await expect(await wl.connect(owner).ownerOf(3)).to.eq(
//       //   dead,
//       // );
//     });
//   });
//   describe("Free claim", async () => {
//     it("Should revert if free claim state is off", async () => {
//       const tx = wl.claimFree([1], 1, proof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.FreeClaimClosed,
//       );
//     });
//     it("Should revert if available supply has reached max", async () => {
//       await wl.setPublicMintState(true);
//       await wl.setFreeClaimState(true);
//       await wl.setWhitelistMintState(true);
//       await wl.freeConfig(10, 10, merkleRoot);
//       const amount = ethers.BigNumber.from(890);
//       const amount2 = ethers.BigNumber.from(100);
//       await wl.connect(acc01).mint(
//         890,
//         Array.from(Array(890).keys()).map(_e => 1),
//         890,
//         { value: price.mul(amount) },
//       );
//       await wl.connect(owner).whitelistMint(
//         100,
//         Array.from(Array(100).keys()).map(_e => 1),
//         100,
//         proof,
//         {
//           value: price.mul(amount2),
//         },
//       );
//       const tx = await wl
//         .connect(owner)
//         .claimFree([1], 1, proof);
//       const fail = wl.connect(owner).claimFree([1], 1, proof);

//       expect(await wl.callStatic.totalSupply()).to.eq(1000);
//       expect(tx).to.be.ok;
//       await expect(fail).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//     it("Should revert if address is not whitelisted", async () => {
//       await wl.setFreeClaimState(true);
//       const tx = wl
//         .connect(acc01)
//         .claimFree([1], 1, wrongProof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AddressDenied,
//       );
//     });
//     it("Should revert if user has already claimed", async () => {
//       await wl.setFreeClaimState(true);
//       await wl.claimFree([1], 1, proof);
//       const tx = wl.claimFree([1], 1, proof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AlreadyClaimed,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       await wl.setFreeClaimState(true);
//       // const amount = ethers.BigNumber.from(2);
//       const dead = ethers.constants.AddressZero;
//       // const ownerOf = wl.callStatic.ownerOf(1);
//       const bal = wl.callStatic.balanceOf(owner.address, 1);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(owner)
//         .claimFree([1], 1, proof);
//       const sup2 = wl.callStatic.totalSupply();
//       const bal2 = wl.callStatic.balanceOf(owner.address, 1);
//       // const ownerOfA = wl.callStatic.ownerOf(1);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, dead, owner.address, 1, 1);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(1);
//       expect(await bal).to.eq(0);
//       expect(await bal2).to.eq(1);
//       // expect(await ownerOfA).to.eq(owner.address);
//       expect(await wl.callStatic.freeSupply()).to.eq(1);

//       // await expect(await wl.connect(owner).ownerOf(2)).to.eq(
//       //   dead,
//       // );
//     });
//     it("Should gift tokens", async () => {
//       await wl.setFreeClaimState(true);
//       const defaultSigners = await ethers.getSigners();
//       const gifted = getSignerAddrs(10, defaultSigners);
//       const tx = await wl.giftTokens(
//         gifted,
//         Array.from(Array(10).keys()).map(_e => 1),
//         10,
//         ethers.constants.AddressZero,
//       );

//       expect(tx).to.be.ok;
//       expect(await wl.callStatic.freeSupply()).to.eq(10);
//       expect(
//         await wl.callStatic.balanceOf(owner.address, 1),
//       ).to.eq(1);
//       expect(
//         await wl.callStatic.balanceOf(amb.address, 2),
//       ).to.eq(1);
//       expect(
//         await wl.callStatic.balanceOf(mad.address, 3),
//       ).to.eq(1);
//       // expect(await wl.callStatic.ownerOf(1)).to.eq(
//       //   owner.address,
//       // );
//       // expect(await wl.callStatic.ownerOf(2)).to.eq(
//       //   amb.address,
//       // );
//       // expect(await wl.callStatic.ownerOf(3)).to.eq(
//       //   mad.address,
//       // );

//       await expect(
//         wl.connect(acc01).giftTokens(
//           gifted,
//           Array.from(Array(10).keys()).map(_e => 1),
//           10,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.mintToCreator(
//           10,
//           Array.from(Array(10).keys()).map(_e => 1),
//           10,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//       await expect(
//         wl.claimFree([1], 1, proof),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//       await expect(
//         wl.giftTokens(
//           gifted,
//           [1],
//           1,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//   });

//   describe("Mint and batch mint to creator", async () => {
//     it("Should mint to creator", async () => {
//       const tx = await wl.mintToCreator(
//         10,
//         Array.from(Array(10).keys()).map(_e => 1),
//         10,
//         ethers.constants.AddressZero,
//       );

//       expect(tx).to.be.ok;
//       expect(await wl.callStatic.freeSupply()).to.eq(10);
//       expect(
//         await wl.callStatic.balanceOf(owner.address, 1),
//       ).to.eq(1);
//       expect(
//         await wl.callStatic.balanceOf(owner.address, 10),
//       ).to.eq(1);
//       // expect(await wl.callStatic.ownerOf(3)).to.eq(
//       //   owner.address,
//       // );
//       await expect(
//         wl.connect(acc01).mintToCreator(
//           100,
//           Array.from(Array(100).keys()).map(_e => 1),
//           100,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.mintToCreator(
//           10,
//           Array.from(Array(10).keys()).map(_e => 1),
//           10,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//     it("Should batch mint to creator", async () => {
//       const tx = await wl.mintBatchToCreator(
//         [1],
//         [1],
//         1,
//         ethers.constants.AddressZero,
//       );
//       await wl.mintToCreator(
//         9,
//         Array.from(Array(9).keys()).map(_e => 1),
//         9,
//         ethers.constants.AddressZero,
//       );

//       expect(tx).to.be.ok;
//       expect(await wl.callStatic.freeSupply()).to.eq(10);
//       expect(
//         await wl.callStatic.balanceOf(owner.address, 1),
//       ).to.eq(1);

//       await expect(
//         wl.connect(acc01).mintBatchToCreator(
//           [100],
//           Array.from(Array(100).keys()).map(_e => 1),
//           100,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.mintToCreator(
//           1,
//           [1],
//           1,
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//   });

//   describe("Burn", async () => {
//     it("Should revert if not owner", async () => {
//       const ids = [1];
//       const tx = wl
//         .connect(acc02)
//         .burn(
//           [acc02.address],
//           ids,
//           [1],
//           ethers.constants.AddressZero,
//         );

//       await expect(tx).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//     });

//     it("Should revert if id is already burnt/hasn't been minted", async () => {
//       const amount = ethers.BigNumber.from(4);
//       const ids = [1, 2, 5];
//       await wl.setPublicMintState(true);
//       await wl.connect(acc02).mint(4, [1, 1, 1, 1], 4, {
//         value: price.mul(amount),
//       });
//       const tx = wl
//         .connect(owner)
//         .burn(
//           [acc02.address, acc02.address, acc02.address],
//           ids,
//           [1, 1, 1],
//           ethers.constants.AddressZero,
//         );

//       await expect(tx).to.be.revertedWith(
//         WhitelistErrors.InvalidAmount,
//       );
//     });
//     it("Should revert if ids length is less than 2", async () => {
//       const Counters = await ethers.getContractFactory(
//         "Counters",
//       );
//       await expect(
//         wl.burn(
//           [acc02.address],
//           [1],
//           [1],
//           ethers.constants.AddressZero,
//         ),
//       ).to.be.revertedWithCustomError(
//         Counters,
//         WhitelistErrors.DecrementOverflow,
//       );
//     });

//     it("Should mint, burn, mint again, update storage and emit event", async () => {
//       const amount = ethers.BigNumber.from(2);
//       await wl.setPublicMintState(true);
//       await wl
//         .connect(acc02)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       await wl
//         .connect(acc01)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       const ids = [1, 2, 3, 4];
//       const tx = await wl.burn(
//         [
//           acc02.address,
//           acc02.address,
//           acc01.address,
//           acc01.address,
//         ],
//         ids,
//         [1, 1, 1, 1],
//         ethers.constants.AddressZero,
//       );
//       await wl
//         .connect(acc01)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       const dead = ethers.constants.AddressZero;
//       const bal1 = await wl.callStatic.balanceOf(
//         acc01.address,
//         1,
//       );
//       const bal2 = await wl.callStatic.balanceOf(
//         acc02.address,
//         3,
//       );
//       const bal3 = await wl.callStatic.balanceOf(
//         acc01.address,
//         5,
//       );
//       const mintCounter = await wl.callStatic.mintCount();

//       expect(tx).to.be.ok;
//       expect(bal1).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(1);
//       expect(mintCounter).to.eq(6);

//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, acc02.address, dead, 1, 1);
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, acc02.address, dead, 2, 1);
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, acc01.address, dead, 3, 1);
//       await expect(tx)
//         .to.emit(wl, "TransferSingle")
//         .withArgs(owner.address, acc01.address, dead, 4, 1);
//     });
//   });
//   describe("Batch burn", async () => {
//     it("Should revert if caller is not the owner", async () => {
//       const amount = ethers.BigNumber.from(3);
//       const ids = [1, 2, 3];
//       await wl.setPublicMintState(true);
//       await wl.mint(3, [1, 1, 1], 3, {
//         value: price.mul(amount),
//       });
//       const tx = wl
//         .connect(acc02)
//         .burnBatch(
//           owner.address,
//           ids,
//           [1, 1, 1],
//           ethers.constants.AddressZero,
//         );

//       await expect(tx).to.be.revertedWith(
//         WhitelistErrors.Unauthorized,
//       );
//     });
//     it("Should revert if id is already burnt/hasn't been minted", async () => {
//       const amount = ethers.BigNumber.from(4);
//       const ids = [1, 2, 5];
//       await wl.setPublicMintState(true);
//       await wl.connect(acc02).mint(4, [1, 1, 1, 1], 4, {
//         value: price.mul(amount),
//       });
//       const tx = wl
//         .connect(owner)
//         .burnBatch(
//           acc02.address,
//           ids,
//           [1, 1, 1, 1],
//           ethers.constants.AddressZero,
//         );
//       await expect(tx).to.be.revertedWith(
//         WhitelistErrors.InvalidAmount,
//       );
//     });
//     it("Should batch burn tokens, update storage and emit event", async () => {
//       const dead = ethers.constants.AddressZero;
//       const one = ethers.constants.One;
//       const amounts = [one, one];
//       const amount = ethers.BigNumber.from(2);
//       await wl.setPublicMintState(true);
//       await wl
//         .connect(acc02)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       await wl
//         .connect(acc01)
//         .mint(2, [1, 1], 2, { value: price.mul(amount) });
//       const ids1 = [1, 2];
//       const ids2 = [3, 4];
//       const tx1 = await wl.burnBatch(
//         acc02.address,
//         ids1,
//         [1, 1],
//         ethers.constants.AddressZero,
//       );
//       const tx2 = await wl.burnBatch(
//         acc01.address,
//         ids2,
//         [1, 1],
//         ethers.constants.AddressZero,
//       );
//       const bal1 = await wl.callStatic.balanceOf(
//         acc02.address,
//         1,
//       );
//       const bal2 = await wl.callStatic.balanceOf(
//         acc02.address,
//         2,
//       );
//       const bal3 = await wl.callStatic.balanceOf(
//         acc01.address,
//         3,
//       );
//       const bal4 = await wl.callStatic.balanceOf(
//         acc01.address,
//         4,
//       );

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       expect(bal1).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(0);
//       expect(bal4).to.eq(0);

//       await expect(tx1)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc02.address,
//           dead,
//           ids1,
//           amounts,
//         );
//       await expect(tx2)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc01.address,
//           dead,
//           ids2,
//           amounts,
//         );
//     });
//     it("Should handle multiple batch burns", async () => {
//       const dead = ethers.constants.AddressZero;
//       const one = ethers.constants.One;
//       const amounts = [one, one, one, one, one];
//       const amount = ethers.BigNumber.from(20);
//       await wl.setPublicMintState(true);
//       await wl.connect(acc02).mint(
//         20,
//         Array.from(Array(20).keys()).map(_e => 1),
//         20,
//         { value: price.mul(amount) },
//       );
//       const ids1 = [1, 2, 3, 4, 5];
//       const ids2 = [6, 7, 8, 9, 10];
//       const ids3 = [11, 12, 13, 14, 15];
//       const ids4 = [16, 17, 18, 19, 20];
//       const tx1 = await wl.burnBatch(
//         acc02.address,
//         ids1,
//         [1, 1, 1, 1, 1],
//         ethers.constants.AddressZero,
//       );
//       const tx2 = await wl.burnBatch(
//         acc02.address,
//         ids2,
//         [1, 1, 1, 1, 1],
//         ethers.constants.AddressZero,
//       );
//       const tx3 = await wl.burnBatch(
//         acc02.address,
//         ids3,
//         [1, 1, 1, 1, 1],
//         ethers.constants.AddressZero,
//       );
//       const tx4 = await wl.burnBatch(
//         acc02.address,
//         ids4,
//         [1, 1, 1, 1, 1],
//         ethers.constants.AddressZero,
//       );

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       expect(tx3).to.be.ok;
//       expect(tx4).to.be.ok;
//       await expect(tx1)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc02.address,
//           dead,
//           ids1,
//           amounts,
//         );
//       await expect(tx2)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc02.address,
//           dead,
//           ids2,
//           amounts,
//         );
//       await expect(tx3)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc02.address,
//           dead,
//           ids3,
//           amounts,
//         );
//       await expect(tx4)
//         .to.emit(wl, "TransferBatch")
//         .withArgs(
//           owner.address,
//           acc02.address,
//           dead,
//           ids4,
//           amounts,
//         );
//     });
//   });

//   describe("Withdraw", async () => {
//     it("Should withdraw contract's funds", async () => {
//       await wl.setPublicMintState(true);
//       await wl.connect(owner).setPublicMintState(true);
//       await wl
//         .connect(acc02)
//         .mint(1, [1], 1, { value: price });
//       const addrs = [
//         mad.address,
//         amb.address,
//         owner.address,
//         wl.address,
//       ];
//       const shares = [
//         ethers.BigNumber.from(1000),
//         ethers.BigNumber.from(2000),
//         ethers.BigNumber.from(7000),
//       ];
//       const vals = [
//         shares[0].mul(price).div(10_000),
//         shares[1].mul(price).div(10_000),
//         shares[2].mul(price).div(10_000),
//         "-1000000000000000000",
//       ];

//       await expect(() =>
//         wl.withdraw(dead),
//       ).to.changeEtherBalances(addrs, vals);

//       expect(
//         await ethers.provider.getBalance(wl.address),
//       ).to.eq(ethers.constants.Zero);

//       await expect(
//         wl.connect(acc01).withdraw(dead),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//     });

//     it("Should withdraw contract's ERC20s", async () => {
//       const prevBal = BigNumber.from(2).pow(255);
//       const payees = [
//         mad.address,
//         amb.address,
//         owner.address,
//       ];
//       const shares = [
//         ethers.BigNumber.from(1000),
//         ethers.BigNumber.from(2000),
//         ethers.BigNumber.from(7000),
//       ];
//       const vals = [
//         shares[0].mul(price).div(10_000),
//         shares[1].mul(price).div(10_000),
//         shares[2].mul(price).div(10_000).add(prevBal),
//       ];
//       const ERC20 = await ethers.getContractFactory(
//         "MockERC20",
//       );
//       const erc20 = (await ERC20.deploy(
//         prevBal,
//       )) as MockERC20;

//       await erc20.mint(wl.address, price);

//       const tx = await wl.withdrawERC20(erc20.address, dead);
//       expect(tx).to.be.ok;
//       expect(
//         await erc20.callStatic.balanceOf(payees[0]),
//       ).to.eq(vals[0]);
//       expect(
//         await erc20.callStatic.balanceOf(payees[1]),
//       ).to.eq(vals[1]);
//       expect(
//         await erc20.callStatic.balanceOf(payees[2]),
//       ).to.eq(vals[2]);
//       expect(
//         await erc20.callStatic.balanceOf(wl.address),
//       ).to.eq(ethers.constants.Zero);
//     });
//   });
//   describe("Public getters", async () => {
//     it("Should query royalty info", async () => {
//       const share = BigNumber.from(750);
//       const base = BigNumber.from(10000);
//       const amount = price.mul(share).div(base);
//       const tx = await wl.royaltyInfo(1, price);

//       expect(tx[0]).to.eq(splitter.address);
//       expect(tx[1]).to.eq(amount);
//     });

//     it("Should query token uri and revert if not yet minted", async () => {
//       await wl.setPublicMintState(true);
//       await wl
//         .connect(acc01)
//         .mint(1, [1], 1, { value: price });
//       const tx = await wl.callStatic.uri(1);
//       const fail = wl.callStatic.uri(2);

//       expect(tx).to.be.ok;
//       expect(tx).to.eq("ipfs://cid/1.json");

//       await expect(fail).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.NotMintedYet,
//       );
//     });

//     it("Should query total supply", async () => {
//       const tx = await wl.callStatic.totalSupply();

//       expect(tx).to.be.ok;
//       expect(tx).to.eq(0);
//     });

//     it("Should query mint count", async () => {
//       const tx = await wl.callStatic.mintCount();
//       expect(tx).to.be.ok;
//       expect(tx).to.eq(0);
//     });

//     it("Should query base uri", async () => {
//       const base = "ipfs://cid/";
//       const tx = await wl.callStatic.getURI();

//       expect(tx).to.be.ok;
//       expect(tx).to.eq(base);
//     });
//   });
//   describe("Interface IDs", async () => {
//     it("Should support interfaces", async () => {
//       const erc165 =
//         getInterfaceID(ERC165Interface).interfaceID._hex;
//       const erc2981 = getInterfaceID(ERC2981Interface)
//         .interfaceID._hex;
//       const erc1155 = getInterfaceID(ERC1155Interface)
//         .interfaceID._hex;
//       const erc1155meta = getInterfaceID(
//         ERC1155MetadataInterface,
//       ).interfaceID._hex;

//       const instrospec =
//         await wl.callStatic.supportsInterface(erc165);
//       const royalty = await wl.callStatic.supportsInterface(
//         erc2981,
//       );
//       const nft = await wl.callStatic.supportsInterface(
//         erc1155,
//       );
//       const metadata = await wl.callStatic.supportsInterface(
//         erc1155meta,
//       );

//       await expect(instrospec).to.eq(true);
//       await expect(royalty).to.eq(true);
//       await expect(nft).to.eq(true);
//       await expect(metadata).to.eq(true);
//     });
//   });
// });
