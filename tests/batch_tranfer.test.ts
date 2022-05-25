// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { initialize, airdropTransfer, checkTransferResult, checkAllTransferred } = require("../scripts/airdrop/220525/ort_airdrop_func_220525");

const transferNth = async (index: number, isEnd: boolean) => {
  expect((await airdropTransfer(index))).to.equal(true);
  expect((await airdropTransfer(index))).to.equal(false); // 같은 번호로 두번째는 전송 안됨
  expect((await checkTransferResult(index))).to.equal(true);
  expect((await checkAllTransferred())).to.equal(isEnd);
}

describe("Ort Airdrop Test", function () {
  let ort;
  let batchTransfer;
  let provider;
  let signer;
  let accounts;

  it("Initialization", async function () {
    accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const ORT = await ethers.getContractFactory("ORT");
    const ort = await ORT.deploy();
    await ort.deployed();
    console.log('ort deployed at:'+ ort.address)
    expect((await ort.name())).to.equal('XREATORS');

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.deploy(ort.address);
    await batchTransfer.deployed();
    console.log('batchTransfer deployed at:'+ batchTransfer.address)
    expect((await batchTransfer.tokenContract())).to.equal(ort.address);

    ort.approve(batchTransfer.address, '8420000000000000000000');
    expect((await ort.allowance(accounts[0], batchTransfer.address)).eq('8420000000000000000000')).to.equal(true);

    expect(initialize(ort.address, batchTransfer.address, accounts[0])).to.equal(true);
  });

  it("BatchTransfer Test", async function() {
    await transferNth(0, false);
    await transferNth(1, false);
    await transferNth(2, false);
    await transferNth(3, false);
    await transferNth(4, false);
    await transferNth(5, false);
    await transferNth(6, false);
    await transferNth(7, false);
    await transferNth(8, false);
    await transferNth(9, false);
    await transferNth(10, false);
    await transferNth(11, false);
    await transferNth(12, false);
    await transferNth(13, false);
    await transferNth(14, false);
    await transferNth(15, false);
    await transferNth(16, false);
    await transferNth(17, false);
    await transferNth(18, false);
    await transferNth(19, false);
    await transferNth(20, true);
  });
});