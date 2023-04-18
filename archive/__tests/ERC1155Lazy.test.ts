// import "@nomicfoundation/hardhat-chai-matchers";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
// import {
//   BigNumber,
//   ContractReceipt,
//   ContractTransaction,
//   Signature,
//   Wallet,
// } from "ethers";
// import { ethers, network } from "hardhat";

// import {
//   ERC1155Lazy,
//   MockERC20,
//   SplitterImpl,
// } from "../../src/types";
// import { dead } from "../utils/madFixtures";
// import { LazyErrors } from "./../utils/errors";
// import {
//   lazyFixture1155, // erc20Fixture,
// } from "./../utils/fixtures";
// import {
//   ERC165Interface,
//   ERC1155Interface,
//   ERC1155MetadataInterface,
//   ERC2981Interface,
//   UserBatch,
//   Voucher,
//   getInterfaceID,
// } from "./../utils/interfaces";

// describe("ERC1155Lazy", () => {
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
//   let lazy: ERC1155Lazy;
//   // let erc20: MockERC20;
//   let vSig: string;
//   let vSigSplit: Signature;
//   let vSigSplit2: Signature;
//   let vRecover: string;
//   let ubRecover: string;
//   let ubSig: string;
//   let ubSigSplit: Signature;
//   let wrongSig: string;
//   let voucher: Voucher;
//   let voucher2: Voucher;
//   let userBatch: UserBatch;
//   let signerAddr: string;
//   let domainCheck: string;
//   let signer: Wallet;

//   const fundAmount: BigNumber =
//     ethers.utils.parseEther("10000");
//   const price: BigNumber = ethers.utils.parseEther("1");
//   const amount: BigNumber = ethers.BigNumber.from(30);

//   before("Set signers and reset network", async () => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     [owner, amb, mad, acc01, acc02] = await (
//       ethers as any
//     ).getSigners();

//     await network.provider.send("hardhat_reset");
//   });
//   beforeEach("Load deployment fixtures", async () => {
//     ({
//       splitter,
//       lazy,
//       vSig,
//       vSigSplit,
//       vSigSplit2,
//       vRecover,
//       ubSig,
//       ubSigSplit,
//       ubRecover,
//       signerAddr,
//       signer,
//       domainCheck,
//       wrongSig,
//       voucher,
//       voucher2,
//       userBatch,
//     } = await loadFixture(lazyFixture1155));
//   });

//   describe("Init", async () => {
//     it("Splitter and ERC1155 should initialize", async () => {
//       await lazy.deployed();
//       await splitter.deployed();
//       expect(lazy).to.be.ok;
//       expect(splitter).to.be.ok;

//       // deployment settings check
//       await expect(await lazy.deployTransaction)
//         .to.emit(lazy, "RoyaltyFeeSet")
//         .withArgs(750)
//         .and.to.emit(lazy, "RoyaltyRecipientSet")
//         .withArgs(splitter.address)
//         .and.to.emit(lazy, "SignerUpdated")
//         .withArgs(signer.address);

//       // splitter settings
//       expect(await lazy.callStatic.splitter()).to.eq(
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
//   describe("Lazy mint", async () => {
//     it("Should mint, update storage and emit events", async () => {
//       const dead = ethers.constants.AddressZero;
//       const deploy: ContractTransaction =
//         await lazy.deployTransaction;
//       const rc: ContractReceipt = await deploy.wait();
//       const event = rc.events?.find(
//         event => event.event === "SignerUpdated",
//       );
//       /* eslint-disable @typescript-eslint/no-non-null-assertion */
//       const _signerAddr = event?.args!["newSigner"];
//       const bal = await lazy.callStatic.balanceOf(
//         owner.address,
//         1,
//       );
//       const bal2 = await lazy.callStatic.balanceOf(
//         amb.address,
//         11,
//       );
//       const bal3 = await lazy.callStatic.balanceOf(
//         mad.address,
//         21,
//       );
//       const sup = await lazy.callStatic.totalSupply();
//       const tx = await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const sup2 = lazy.callStatic.totalSupply();
//       // const ownerOfA = lazy.callStatic.ownerOf(1);
//       // const ownerOfB = lazy.callStatic.ownerOf(11);
//       // const ownerOfC = lazy.callStatic.ownerOf(21);

//       expect(vRecover)
//         .to.eq(_signerAddr.toLowerCase())
//         .and.to.eq(signerAddr);
//       expect(vSig.length).to.eq(132);
//       expect(tx).to.be.ok;
//       expect(bal).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(0);
//       expect(sup).to.eq(0);
//       expect(
//         await lazy.callStatic.balanceOf(owner.address, 1),
//       ).to.eq(1);
//       expect(
//         await lazy.callStatic.balanceOf(amb.address, 11),
//       ).to.eq(1);
//       expect(
//         await lazy.callStatic.balanceOf(mad.address, 21),
//       ).to.eq(1);
//       // expect(await ownerOfA).to.eq(owner.address);
//       // expect(await ownerOfB).to.eq(amb.address);
//       // expect(await ownerOfC).to.eq(mad.address);
//       expect(await sup2).to.eq(30);
//       expect(
//         await lazy.callStatic.usedVouchers(voucher.voucherId),
//       ).to.eq(true);
//       await expect(tx)
//         .to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, dead, owner.address, 1, 1)
//         .and.to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, dead, amb.address, 11, 1)
//         .and.to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, dead, mad.address, 21, 1);
//     });
//     it("Should revert if voucher has already been used", async () => {
//       // const sigSplit = ethers.utils.splitSignature(signature);
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const tx = lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.UsedVoucher,
//       );
//     });
//     it("Should revert if signature is invalid", async () => {
//       const wSigSplit = ethers.utils.splitSignature(wrongSig);
//       const tx = lazy.lazyMint(
//         voucher,
//         wSigSplit.v,
//         wSigSplit.r,
//         wSigSplit.s,
//         { value: price.mul(amount) },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.InvalidSigner,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       const tx = lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.WrongPrice,
//       );
//     });
//   });
//   describe("Lazy batch mint", async () => {
//     it("Should mint, update storage and emit events", async () => {
//       const dead = ethers.constants.AddressZero;
//       const one = ethers.constants.One;
//       const ids = [1, 33, 7];
//       const amounts = [one, one, one];
//       const deploy: ContractTransaction =
//         await lazy.deployTransaction;
//       const rc: ContractReceipt = await deploy.wait();
//       const event = rc.events?.find(
//         event => event.event === "SignerUpdated",
//       );
//       /* eslint-disable @typescript-eslint/no-non-null-assertion */
//       const _signerAddr = event?.args!["newSigner"];
//       const bal = await lazy.callStatic.balanceOf(
//         owner.address,
//         1,
//       );
//       const bal2 = await lazy.callStatic.balanceOf(
//         owner.address,
//         33,
//       );
//       const bal3 = await lazy.callStatic.balanceOf(
//         owner.address,
//         7,
//       );
//       const sup = await lazy.callStatic.totalSupply();

//       const tx = await lazy.lazyMintBatch(
//         userBatch,
//         ubSigSplit.v,
//         ubSigSplit.r,
//         ubSigSplit.s,
//         { value: price.mul(ethers.BigNumber.from(3)) },
//       );
//       const sup2 = lazy.callStatic.totalSupply();
//       // const ownerOfA = lazy.callStatic.ownerOf(1);
//       // const ownerOfB = lazy.callStatic.ownerOf(33);
//       // const ownerOfC = lazy.callStatic.ownerOf(7);

//       expect(ubRecover)
//         .to.eq(_signerAddr.toLowerCase())
//         .and.to.eq(signerAddr);
//       expect(ubSig.length).to.eq(132);
//       expect(tx).to.be.ok;
//       expect(bal).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(0);
//       expect(sup).to.eq(0);
//       expect(
//         await lazy.callStatic.balanceOf(owner.address, 1),
//       ).to.eq(1);
//       expect(
//         await lazy.callStatic.balanceOf(owner.address, 33),
//       ).to.eq(1);
//       expect(
//         await lazy.callStatic.balanceOf(owner.address, 7),
//       ).to.eq(1);
//       // expect(await ownerOfA).to.eq(owner.address);
//       // expect(await ownerOfB).to.eq(owner.address);
//       // expect(await ownerOfC).to.eq(owner.address);
//       expect(await sup2).to.eq(3);
//       expect(
//         await lazy.callStatic.usedVouchers(
//           userBatch.voucherId,
//         ),
//       ).to.eq(true);
//       await expect(tx)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           dead,
//           owner.address,
//           ids,
//           amounts,
//         );
//     });
//     it("Should revert if voucherId has already been used", async () => {
//       await lazy.lazyMintBatch(
//         userBatch,
//         ubSigSplit.v,
//         ubSigSplit.r,
//         ubSigSplit.s,
//         { value: price.mul(ethers.BigNumber.from(3)) },
//       );
//       const tx = lazy.lazyMintBatch(
//         userBatch,
//         ubSigSplit.v,
//         ubSigSplit.r,
//         ubSigSplit.s,
//         { value: price.mul(ethers.BigNumber.from(3)) },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.UsedVoucher,
//       );
//     });
//     it("Should revert if signature is invalid", async () => {
//       const wSigSplit = ethers.utils.splitSignature(wrongSig);
//       const tx = lazy.lazyMintBatch(
//         userBatch,
//         wSigSplit.v,
//         wSigSplit.r,
//         wSigSplit.s,
//         { value: price.mul(ethers.BigNumber.from(3)) },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.InvalidSigner,
//       );
//     });
//     it("Should revert if price is wrong", async () => {
//       const tx = lazy.lazyMintBatch(
//         userBatch,
//         ubSigSplit.v,
//         ubSigSplit.r,
//         ubSigSplit.s,
//         { value: price },
//       );

//       await expect(tx).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.WrongPrice,
//       );
//     });
//   });

//   // `setSigner` already tested in "Init"
//   describe("Only owner functions", async () => {
//     it("Should set URI and emit event", async () => {
//       const res = "";
//       const tx = await lazy.setURI(res);
//       const fail = lazy.connect(acc02).setURI(res);

//       expect(tx).to.be.ok;
//       await expect(tx)
//         .to.emit(lazy, "BaseURISet")
//         .withArgs(res);
//       await expect(fail).to.be.revertedWith(
//         LazyErrors.Unauthorized,
//       );
//     });
//     it("Should withdraw and update balances", async () => {
//       const prevBal = BigNumber.from(2).pow(255);
//       const ERC20 = await ethers.getContractFactory(
//         "MockERC20",
//       );
//       const erc20 = (await ERC20.deploy(
//         prevBal,
//       )) as MockERC20;

//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) }, // amount := 30
//       );
//       await erc20.mint(lazy.address, price);
//       const tx = await lazy.withdrawERC20(
//         erc20.address,
//         dead,
//       );
//       const addrs = [
//         mad.address,
//         amb.address,
//         owner.address,
//         lazy.address,
//       ];
//       const shares = [
//         ethers.BigNumber.from(1000),
//         ethers.BigNumber.from(2000),
//         ethers.BigNumber.from(7000),
//       ];
//       const vals = [
//         shares[0].mul(price.mul(amount)).div(10_000),
//         shares[1].mul(price.mul(amount)).div(10_000),
//         shares[2].mul(price.mul(amount)).div(10_000),
//         "-30000000000000000000",
//       ];

//       const vals2 = [
//         shares[0].mul(price).div(10_000),
//         shares[1].mul(price).div(10_000),
//         shares[2].mul(price).div(10_000).add(prevBal),
//       ];

//       await expect(() =>
//         lazy.withdraw(dead),
//       ).to.changeEtherBalances(addrs, vals);

//       expect(tx).to.be.ok;
//       expect(
//         await erc20.callStatic.balanceOf(addrs[0]),
//       ).to.eq(vals2[0]);
//       expect(
//         await erc20.callStatic.balanceOf(addrs[1]),
//       ).to.eq(vals2[1]);
//       expect(
//         await erc20.callStatic.balanceOf(addrs[2]),
//       ).to.eq(vals2[2]);

//       await expect(
//         lazy.connect(acc01).withdraw(dead),
//       ).to.be.revertedWith(LazyErrors.Unauthorized);
//       await expect(
//         lazy
//           .connect(acc02)
//           .withdrawERC20(erc20.address, dead),
//       ).to.be.revertedWith(LazyErrors.Unauthorized);

//       expect(await erc20.balanceOf(lazy.address)).to.eq(
//         ethers.constants.Zero,
//       );

//       expect(
//         await ethers.provider.getBalance(lazy.address),
//       ).to.eq(ethers.constants.Zero);
//     });
//   });
//   describe("Burn", async () => {
//     it("Should revert if not owner", async () => {
//       await expect(
//         lazy
//           .connect(acc01)
//           .burn([acc01.address], [1], [1], owner.address),
//       ).to.be.revertedWith(LazyErrors.Unauthorized);
//     });
//     it("Should revert if id is already burnt/hasn't been minted", async () => {
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const ids = [1, 33, 7];
//       const tx = lazy
//         .connect(owner)
//         .burn(
//           [owner.address, owner.address, owner.address],
//           ids,
//           [1, 1, 1],
//           owner.address,
//         );

//       await expect(tx).to.be.revertedWith(
//         LazyErrors.InvalidAmount,
//       );
//     });
//     it("Should revert if ids length is less than 2", async () => {
//       const Counters = await ethers.getContractFactory(
//         "Counters",
//       );
//       await expect(
//         lazy.burn([owner.address], [1], [1], owner.address),
//       ).to.be.revertedWithCustomError(
//         Counters,
//         LazyErrors.DecrementOverflow,
//       );
//     });
//     it("Should mint, burn, mint again, update storage and emit events", async () => {
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );

//       const ids = [1, 13, 20, 30];
//       const tx = await lazy.burn(
//         [
//           voucher.users[0],
//           voucher.users[1],
//           voucher.users[1],
//           voucher.users[2],
//         ],
//         ids,
//         [1, 1, 1, 1],
//         owner.address,
//       );

//       await lazy.lazyMint(
//         voucher2,
//         vSigSplit2.v,
//         vSigSplit2.r,
//         vSigSplit2.s,
//         { value: price.mul(amount) },
//       );

//       const dead = ethers.constants.AddressZero;
//       const mintCounter =
//         await lazy.callStatic.mintCount();
//       const bal1 = await lazy.callStatic.balanceOf(
//         owner.address,
//         1,
//       );
//       const bal2 = await lazy.callStatic.balanceOf(
//         amb.address,
//         13,
//       );
//       const bal3 = await lazy.callStatic.balanceOf(
//         mad.address,
//         30,
//       );

//       expect(tx).to.be.ok;
//       expect(bal1).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(0);
//       expect(mintCounter).to.eq(60);

//       await expect(tx)
//         .to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, owner.address, dead, 1, 1)
//         .and.to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, amb.address, dead, 13, 1)
//         .and.to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, amb.address, dead, 20, 1)
//         .and.to.emit(lazy, "TransferSingle")
//         .withArgs(owner.address, mad.address, dead, 30, 1);
//     });
//   });

//   describe("Batch burn", async () => {
//     it("Should revert if caller is not the owner", async () => {
//       const ids = [1, 2, 3];
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const tx = lazy
//         .connect(acc02)
//         .burnBatch(
//           owner.address,
//           ids,
//           [1, 1, 1],
//           acc02.address,
//         );

//       await expect(tx).to.be.revertedWith(
//         LazyErrors.Unauthorized,
//       );
//     });
//     it("Should revert if id is already burnt/hasn't been minted", async () => {
//       const ids = [1, 2, 5];
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const tx = lazy
//         .connect(owner)
//         .burnBatch(
//           acc02.address,
//           ids,
//           [1, 1, 1],
//           owner.address,
//         );

//       await expect(tx).to.be.revertedWith(
//         LazyErrors.WrongFrom,
//       );
//     });
//     it("Should batch burn tokens, update storage and emit event", async () => {
//       const dead = ethers.constants.AddressZero;
//       const one = ethers.constants.One;
//       const amounts = [one, one, one, one];
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const ids = [1, 2, 3, 4];
//       const tx = await lazy.burnBatch(
//         owner.address,
//         ids,
//         [1, 1, 1, 1],
//         owner.address,
//       );
//       const bal1 = await lazy.callStatic.balanceOf(
//         owner.address,
//         1,
//       );
//       const bal2 = await lazy.callStatic.balanceOf(
//         owner.address,
//         2,
//       );
//       const bal3 = await lazy.callStatic.balanceOf(
//         owner.address,
//         3,
//       );
//       const bal4 = await lazy.callStatic.balanceOf(
//         owner.address,
//         4,
//       );

//       expect(tx).to.be.ok;
//       expect(bal1).to.eq(0);
//       expect(bal2).to.eq(0);
//       expect(bal3).to.eq(0);
//       expect(bal4).to.eq(0);

//       await expect(tx)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           owner.address,
//           dead,
//           ids,
//           amounts,
//         );
//     });
//     it("Should handle multiple batch burns", async () => {
//       const dead = ethers.constants.AddressZero;
//       const one = ethers.constants.One;
//       const amounts = [one, one, one, one, one];
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const ids1 = [1, 2, 3, 4, 5];
//       const ids2 = [6, 7, 8, 9, 10];
//       const ids3 = [11, 12, 13, 14, 15];
//       const ids4 = [16, 17, 18, 19, 20];
//       const tx1 = await lazy.burnBatch(
//         owner.address,
//         ids1,
//         [1, 1, 1, 1, 1],
//         owner.address,
//       );
//       const tx2 = await lazy.burnBatch(
//         owner.address,
//         ids2,
//         [1, 1, 1, 1, 1],
//         owner.address,
//       );
//       const tx3 = await lazy.burnBatch(
//         amb.address,
//         ids3,
//         [1, 1, 1, 1, 1],
//         owner.address,
//       );
//       const tx4 = await lazy.burnBatch(
//         amb.address,
//         ids4,
//         [1, 1, 1, 1, 1],
//         owner.address,
//       );

//       expect(tx1).to.be.ok;
//       expect(tx2).to.be.ok;
//       expect(tx3).to.be.ok;
//       expect(tx4).to.be.ok;
//       await expect(tx1)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           owner.address,
//           dead,
//           ids1,
//           amounts,
//         );
//       await expect(tx2)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           owner.address,
//           dead,
//           ids2,
//           amounts,
//         );
//       await expect(tx3)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           amb.address,
//           dead,
//           ids3,
//           amounts,
//         );
//       await expect(tx4)
//         .to.emit(lazy, "TransferBatch")
//         .withArgs(
//           owner.address,
//           amb.address,
//           dead,
//           ids4,
//           amounts,
//         );
//     });
//   });

//   describe("Public getters", async () => {
//     it("Should query royalty info", async () => {
//       const share = BigNumber.from(750);
//       const base = BigNumber.from(10000);
//       const amount = price.mul(share).div(base);
//       const tx = await lazy.royaltyInfo(1, price);

//       expect(tx[0]).to.eq(splitter.address);
//       expect(tx[1]).to.eq(amount);
//     });
//     it("Should retrieve the domain separator", async () => {
//       const cDomain = await lazy.DOMAIN_SEPARATOR();

//       expect(cDomain).to.eq(domainCheck);
//     });

//     it("Should retrive URI and total supply", async () => {
//       const res = "0x70616b6d616e";
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const base = await lazy.callStatic.getURI();
//       const sup = await lazy.callStatic.totalSupply();
//       await lazy.burn(
//         [voucher.users[0], voucher.users[0]],
//         [1, 2],
//         [1, 1],
//         owner.address,
//       );
//       await lazy.setURI(res);
//       const base2 = await lazy.callStatic.getURI();

//       const sup2 = await lazy.callStatic.totalSupply();
//       expect(base).to.be.ok;
//       expect(sup).to.be.ok;
//       expect(base).to.eq("ipfs://cid/");
//       expect(base2).to.eq(res);
//       expect(sup).to.eq(30);
//       expect(sup2).to.eq(28);
//     });

//     it("Should query total supply", async () => {
//       const tx = await lazy.callStatic.totalSupply();

//       expect(tx).to.be.ok;
//       expect(tx).to.eq(0);
//     });

//     it("Should query mint count", async () => {
//       const tx = await lazy.callStatic.mintCount();
//       expect(tx).to.be.ok;
//       expect(tx).to.eq(0);
//     });

//     it("Should retrive tokenURI and revert if not yet minted", async () => {
//       await lazy.lazyMint(
//         voucher,
//         vSigSplit.v,
//         vSigSplit.r,
//         vSigSplit.s,
//         { value: price.mul(amount) },
//       );
//       const tx = await lazy.callStatic.uri(1);

//       expect(tx).to.be.ok;
//       expect(tx).to.eq("ipfs://cid/1.json");
//       await expect(
//         lazy.callStatic.uri(777),
//       ).to.be.revertedWithCustomError(
//         lazy,
//         LazyErrors.NotMintedYet,
//       );
//     });
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
//         await lazy.callStatic.supportsInterface(erc165);
//       const royalty = await lazy.callStatic.supportsInterface(
//         erc2981,
//       );
//       const nft = await lazy.callStatic.supportsInterface(
//         erc1155,
//       );
//       const metadata =
//         await lazy.callStatic.supportsInterface(erc1155meta);

//       await expect(instrospec).to.eq(true);
//       await expect(royalty).to.eq(true);
//       await expect(nft).to.eq(true);
//       await expect(metadata).to.eq(true);
//     });
//   });
// });
