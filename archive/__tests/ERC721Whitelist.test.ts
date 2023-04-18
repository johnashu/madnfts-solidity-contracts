// import "@nomicfoundation/hardhat-chai-matchers";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
// import { BigNumber, Wallet } from "ethers";
// import { ethers, network } from "hardhat";

// import {
//   ERC721Whitelist,
//   MockERC20,
//   SplitterImpl,
// } from "../../src/types";
// import { dead } from "../utils/madFixtures";
// import { WhitelistErrors } from "./../utils/errors";
// import {
//   getSignerAddrs, // erc20Fixture,
//   whitelistFixture721,
// } from "./../utils/fixtures";
// import {
//   ERC165Interface,
//   ERC721Interface,
//   ERC721MetadataInterface,
//   ERC2981Interface,
//   getInterfaceID,
// } from "./../utils/interfaces";

// describe("ERC721Whitelist", () => {
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
//   let wl: ERC721Whitelist;
//   // let erc20: MockERC20;
//   let merkleRoot: string;
//   let proof: string[];
//   let wrongProof: string[];
//   // let tree: MerkleTree;
//   // let rSigner: Signer;

//   // let tx:ContractTransaction;
//   // let rc:ContractReceipt;

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
//       await loadFixture(whitelistFixture721));
//   });

//   describe("Init", async () => {
//     it("Splitter and ERC721 should initialize", async () => {
//       await wl.deployed();
//       await splitter.deployed();
//       expect(wl).to.be.ok;
//       expect(splitter).to.be.ok;

//       // check each global var including wl/free config settings
//       expect(await wl.callStatic.name()).to.eq(
//         "721Whitelist",
//       );
//       expect(await wl.callStatic.symbol()).to.eq("WHITELIST");

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

//     it("Should set baseURI and emit event", async () => {
//       const res = "";
//       const tx = await wl.setBaseURI(res);
//       const fail = wl.connect(acc02).setBaseURI(res);

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
//       const tx = wl.mint(ethers.constants.NegativeOne);
//       const tx2 = wl.mint(over);

//       await expect(tx).to.be.reverted.revertedWithoutReason;
//       await expect(tx2).to.be.reverted.revertedWithoutReason;
//     });
//     it("Should revert if public mint state is off", async () => {
//       const tx = wl.connect(acc02).mint(1, { value: price });

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
//       await wl
//         .connect(acc01)
//         .mint(890, { value: price.mul(amount) });
//       const tx = wl.connect(acc02).mint(1, { value: price });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxMintReached,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setPublicMintState(true);
//       const tx = wl.connect(acc02).mint(1);

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(2);
//       const dead = ethers.constants.AddressZero;
//       // const ownerOf = wl.callStatic.ownerOf(1);
//       const bal = wl.callStatic.balanceOf(acc01.address);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(acc01)
//         .mint(2, { value: price.mul(amount) });
//       const sup2 = wl.callStatic.totalSupply();
//       const bal2 = wl.callStatic.balanceOf(acc01.address);
//       const ownerOfA = wl.callStatic.ownerOf(1);
//       const ownerOfB = wl.callStatic.ownerOf(2);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(dead, acc01.address, 1);
//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(dead, acc01.address, 2);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(2);
//       expect(await bal).to.eq(0);
//       expect(await bal2).to.eq(2);
//       expect(await ownerOfA).to.eq(acc01.address);
//       expect(await ownerOfB).to.eq(acc01.address);

//       await expect(
//         wl.connect(owner).ownerOf(3),
//       ).to.be.revertedWith(WhitelistErrors.NotMinted);
//     });
//   });

//   describe("Whitelist mint", async () => {
//     it("Should revert if value under/overflows", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl.whitelistMint(
//         ethers.constants.NegativeOne,
//         proof,
//       );
//       const tx2 = wl.whitelistMint(256, proof);

//       await expect(tx).to.be.revertedWithoutReason;
//       await expect(tx2).to.be.revertedWithoutReason;
//     });
//     it("Should revert if whitelist mint state is off", async () => {
//       const tx = wl.whitelistMint(1, proof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WhitelistMintClosed,
//       );
//     });
//     it("Should revert if whitelist supply has reached max", async () => {
//       await wl.setPublicMintState(true);
//       const amount = ethers.BigNumber.from(890);
//       await wl
//         .connect(acc01)
//         .mint(890, { value: price.mul(amount) });
//       await wl.setWhitelistMintState(true);
//       const amount2 = ethers.BigNumber.from(100);
//       await wl.connect(owner).whitelistMint(100, proof, {
//         value: price.mul(amount2),
//       });
//       const tx = wl
//         .connect(owner)
//         .whitelistMint(1, proof, { value: price });

//       expect(await wl.callStatic.totalSupply()).to.eq(990);
//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxWhitelistReached,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       await wl.setWhitelistMintState(true);
//       const tx = wl.connect(owner).whitelistMint(1, proof);

//       await expect(tx).be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.WrongPrice,
//       );
//     });
//     it("Should revert if address is not whitelisted", async () => {
//       // ({ wrongProof } = await loadFixture(wlFixture721));
//       // const signers = await ethers.getSigners();
//       // const notwhitelisted = signers.slice(5, 10);
//       // const wrong = tree.getHexProof(
//       //   padBuffer(notwhitelisted[3].address),
//       // );
//       // const signer = randomSigners(1);
//       // const rSigner = randomSigners(1)[0];
//       // const signer = await rSigner.getAddress();
//       // await owner.sendTransaction({
//       //   to: signer,
//       //   value: price,
//       // });
//       // const sigProv = rSigner.connect(ethers.provider);
//       // // const sig = signer[0];
//       // console.log(signer);
//       // console.log(signer);
//       await wl.setWhitelistMintState(true);
//       const tx = wl
//         .connect(acc01)
//         .whitelistMint(1, wrongProof, { value: price });

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AddressDenied,
//       );
//     });
//     it("Should mint, update storage and emit events", async () => {
//       // ({ wl, merkleRoot, proof } = await loadFixture(wlFixture721));
//       // expect(await wl.callStatic.whitelistMerkleRoot()).to.eq(merkleRoot);
//       // console.log(merkleRoot);
//       // const signers = await ethers.getSigners();
//       // const whitelisted = signers.slice(0, 5);
//       // const addr = whitelisted[0];
//       await wl.setWhitelistMintState(true);
//       const amount = ethers.BigNumber.from(2);
//       const dead = ethers.constants.AddressZero;
//       // const ownerOf = wl.callStatic.ownerOf(1);
//       const bal = wl.callStatic.balanceOf(owner.address);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl
//         .connect(owner)
//         .whitelistMint(2, proof, {
//           value: price.mul(amount),
//         });
//       const sup2 = wl.callStatic.totalSupply();
//       const bal2 = wl.callStatic.balanceOf(owner.address);
//       const ownerOfA = wl.callStatic.ownerOf(1);
//       const ownerOfB = wl.callStatic.ownerOf(2);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(dead, owner.address, 1);
//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(dead, owner.address, 2);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(2);
//       expect(await bal).to.eq(0);
//       expect(await bal2).to.eq(2);
//       expect(await ownerOfA).to.eq(owner.address);
//       expect(await ownerOfB).to.eq(owner.address);
//       expect(await wl.callStatic.whitelistMinted()).to.eq(2);

//       await expect(
//         wl.connect(owner).ownerOf(3),
//       ).to.be.revertedWith(WhitelistErrors.NotMinted);
//     });
//   });

//   describe("Free claim", async () => {
//     it("Should revert if free claim state is off", async () => {
//       const tx = wl.claimFree(proof);

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
//       await wl
//         .connect(acc01)
//         .mint(890, { value: price.mul(amount) });
//       await wl.connect(owner).whitelistMint(100, proof, {
//         value: price.mul(amount2),
//       });
//       const tx = await wl.connect(owner).claimFree(proof);
//       const fail = wl.connect(owner).claimFree(proof);

//       expect(await wl.callStatic.totalSupply()).to.eq(1000);
//       expect(tx).to.be.ok;
//       await expect(fail).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//     it("Should revert if address is not whitelisted", async () => {
//       await wl.setFreeClaimState(true);
//       const tx = wl.connect(acc01).claimFree(wrongProof);

//       await expect(tx).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.AddressDenied,
//       );
//     });
//     it("Should revert if user has already claimed", async () => {
//       await wl.setFreeClaimState(true);
//       await wl.claimFree(proof);
//       const tx = wl.claimFree(proof);

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
//       const bal = wl.callStatic.balanceOf(owner.address);
//       const sup = wl.callStatic.totalSupply();
//       const tx = await wl.connect(owner).claimFree(proof);
//       const sup2 = wl.callStatic.totalSupply();
//       const bal2 = wl.callStatic.balanceOf(owner.address);
//       const ownerOfA = wl.callStatic.ownerOf(1);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(dead, owner.address, 1);
//       expect(await sup).to.eq(0);
//       expect(await sup2).to.eq(1);
//       expect(await bal).to.eq(0);
//       expect(await bal2).to.eq(1);
//       expect(await ownerOfA).to.eq(owner.address);
//       expect(await wl.callStatic.freeSupply()).to.eq(1);

//       await expect(
//         wl.connect(owner).ownerOf(2),
//       ).to.be.revertedWith(WhitelistErrors.NotMinted);
//     });

//     it("Should mint to creator", async () => {
//       const tx = await wl.mintToCreator(10, owner.address);

//       expect(tx).to.be.ok;
//       expect(await wl.callStatic.freeSupply()).to.eq(10);
//       expect(
//         await wl.callStatic.balanceOf(owner.address),
//       ).to.eq(10);
//       expect(await wl.callStatic.ownerOf(3)).to.eq(
//         owner.address,
//       );

//       await expect(
//         wl.connect(acc01).mintToCreator(100, owner.address),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.mintToCreator(10, owner.address),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//     it("Should gift tokens", async () => {
//       await wl.setFreeClaimState(true);
//       const defaultSigners = await ethers.getSigners();
//       const gifted = getSignerAddrs(10, defaultSigners);
//       const tx = await wl.giftTokens(gifted, owner.address);

//       expect(tx).to.be.ok;
//       expect(await wl.callStatic.freeSupply()).to.eq(10);
//       expect(
//         await wl.callStatic.balanceOf(owner.address),
//       ).to.eq(1);
//       expect(
//         await wl.callStatic.balanceOf(amb.address),
//       ).to.eq(1);
//       expect(
//         await wl.callStatic.balanceOf(mad.address),
//       ).to.eq(1);
//       expect(await wl.callStatic.ownerOf(1)).to.eq(
//         owner.address,
//       );
//       expect(await wl.callStatic.ownerOf(2)).to.eq(
//         amb.address,
//       );
//       expect(await wl.callStatic.ownerOf(3)).to.eq(
//         mad.address,
//       );

//       await expect(
//         wl.connect(acc01).giftTokens(gifted, owner.address),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//       await expect(
//         wl.mintToCreator(10, owner.address),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//       await expect(
//         wl.claimFree(proof),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//       await expect(
//         wl.giftTokens(gifted, owner.address),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.MaxFreeReached,
//       );
//     });
//   });

//   describe("Burn", async () => {
//     it("Should revert if not owner", async () => {
//       await expect(
//         wl.connect(acc01).burn([1], owner.address),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//     });
//     it("Should revert if id is already burnt/hasn't been minted", async () => {
//       const amount = ethers.BigNumber.from(4);
//       const ids = [1, 2, 5];
//       await wl.setPublicMintState(true);
//       await wl
//         .connect(acc02)
//         .mint(4, { value: price.mul(amount) });
//       const tx = wl.connect(owner).burn(ids, owner.address);

//       await expect(tx).to.be.revertedWith(
//         WhitelistErrors.NotMinted,
//       );
//     });
//     it("Should revert if ids length is less than 2", async () => {
//       const Counters = await ethers.getContractFactory(
//         "Counters",
//       );
//       await expect(
//         wl.burn([1], owner.address),
//       ).to.be.revertedWithCustomError(
//         Counters,
//         WhitelistErrors.DecrementOverflow,
//       );
//     });
//     it("Should mint, burn then mint again, update storage and emit event", async () => {
//       await wl.setPublicMintState(true);
//       await wl.giftTokens(
//         [acc02.address, acc01.address],
//         owner.address,
//       );
//       await wl.giftTokens(
//         [acc02.address, acc01.address],
//         owner.address,
//       );

//       const ids = [1, 2, 3, 4];
//       const tx = await wl.burn(ids, owner.address);

//       await wl.giftTokens(
//         [acc02.address, acc01.address],
//         owner.address,
//       );

//       const dead = ethers.constants.AddressZero;
//       const bal1 = await wl.callStatic.balanceOf(
//         acc01.address,
//       );
//       const bal2 = await wl.callStatic.balanceOf(
//         acc02.address,
//       );
//       const approved1 = await wl.callStatic.getApproved(1);
//       const approved2 = await wl.callStatic.getApproved(2);
//       const approved3 = await wl.callStatic.getApproved(3);
//       const approved4 = await wl.callStatic.getApproved(4);
//       const mintCounter = await wl.callStatic.mintCount();

//       expect(tx).to.be.ok;
//       expect(bal1).to.eq(1);
//       expect(bal2).to.eq(1);
//       expect(approved1).to.eq(dead);
//       expect(approved2).to.eq(dead);
//       expect(approved3).to.eq(dead);
//       expect(approved4).to.eq(dead);
//       expect(mintCounter).to.eq(6);

//       await expect(tx)
//         .to.emit(wl, "Transfer")
//         .withArgs(acc02.address, dead, 1)
//         .and.to.emit(wl, "Transfer")
//         .withArgs(acc02.address, dead, 3)
//         .and.to.emit(wl, "Transfer")
//         .withArgs(acc01.address, dead, 2)
//         .and.to.emit(wl, "Transfer")
//         .withArgs(acc01.address, dead, 4);
//     });
//   });

//   describe("Public getters", async () => {
//     it("Should retrive baseURI and total supply", async () => {
//       const res = "0x70616b6d616e";
//       const amount = ethers.BigNumber.from(4);
//       await wl.setPublicMintState(true);
//       await wl.mint(4, { value: price.mul(amount) });
//       const base = await wl.callStatic.baseURI();
//       const sup = await wl.callStatic.totalSupply();
//       // console.log(await wl.burn([1,2]));
//       await wl.burn([1, 2], owner.address);
//       // await wl.burn([1,2])
//       await wl.setBaseURI(res);
//       const base2 = await wl.callStatic.baseURI();

//       const sup2 = await wl.callStatic.totalSupply();
//       expect(base).to.be.ok;
//       expect(sup).to.be.ok;
//       expect(base).to.eq("ipfs://cid/");
//       expect(base2).to.eq(res);
//       expect(sup).to.eq(4);
//       expect(sup2).to.eq(2);
//     });

//     it("Should retrive tokenURI and revert if not yet minted", async () => {
//       await wl.mintToCreator(1, owner.address);
//       const tx = await wl.callStatic.tokenURI(1);

//       expect(tx).to.be.ok;
//       expect(tx).to.eq("ipfs://cid/1.json");
//       await expect(
//         wl.callStatic.tokenURI(2),
//       ).to.be.revertedWithCustomError(
//         wl,
//         WhitelistErrors.NotMintedYet,
//       );
//     });

//     it("Should query mint count", async () => {
//       const tx = await wl.callStatic.mintCount();
//       expect(tx).to.be.ok;
//       expect(tx).to.eq(0);
//     });

//     it("Should support interfaces", async () => {
//       const erc165 =
//         getInterfaceID(ERC165Interface).interfaceID._hex;
//       const erc2981 = getInterfaceID(ERC2981Interface)
//         .interfaceID._hex;
//       const erc721 =
//         getInterfaceID(ERC721Interface).interfaceID._hex;
//       const erc721meta = getInterfaceID(
//         ERC721MetadataInterface,
//       ).interfaceID._hex;

//       const instrospec =
//         await wl.callStatic.supportsInterface(erc165);
//       const royalty = await wl.callStatic.supportsInterface(
//         erc2981,
//       );
//       const nft = await wl.callStatic.supportsInterface(
//         erc721,
//       );
//       const metadata = await wl.callStatic.supportsInterface(
//         erc721meta,
//       );

//       await expect(instrospec).to.eq(true);
//       await expect(royalty).to.eq(true);
//       await expect(nft).to.eq(true);
//       await expect(metadata).to.eq(true);
//     });
//   });

//   describe("Withdrawing", async () => {
//     it("Should revert if not the owner", async () => {
//       await wl.connect(owner).setPublicMintState(true);
//       await wl.connect(acc02).mint(1, { value: price });

//       await expect(
//         wl
//           .connect(acc01)
//           .withdraw(ethers.constants.AddressZero),
//       ).to.be.revertedWith(WhitelistErrors.Unauthorized);
//     });

//     it("Should update balances of contract and owner", async () => {
//       await wl.connect(owner).setPublicMintState(true);
//       await wl.connect(acc02).mint(1, { value: price });
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
// });
