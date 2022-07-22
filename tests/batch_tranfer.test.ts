// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { initialize, airdropTransfer, checkTransferResult, checkAllTransferred } = require("../scripts/airdrop/220526/ort_airdrop_func_220526");

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
    console.log(BatchTransfer);
    const batchTransfer = await BatchTransfer.deploy(ort.address);
    await batchTransfer.deployed();
    console.log('batchTransfer deployed at:'+ batchTransfer.address)
    expect((await batchTransfer.tokenContract())).to.equal(ort.address);

    ort.approve(batchTransfer.address, '4550000000000000000000');
    expect((await ort.allowance(accounts[0], batchTransfer.address)).eq('4550000000000000000000')).to.equal(true);

    expect(initialize(ort.address, batchTransfer.address, accounts[0])).to.equal(true);
  });

  it("BatchTransfer Test", async function() {
    let i;
    const addrs= {};

    for (i = 0; i < 21; i++) {
      expect((await airdropTransfer(i))).to.not.equal(false);
      expect((await airdropTransfer(i))).to.equal(false); // 같은 번호로 두번째는 보내지지 않음
      if (i == 6)
        i = 19; // 테스트용으로 JUMP (다 실행하면 오래 걸리기도 하고 메모리가 못 버텨서 죽음...)
    }

    expect((await checkAllTransferred())).to.equal(true);

    for (i = 0; i < 21; i++) {
      const result = await checkTransferResult(i);
      if (result) {
        console.log(i, result);
        for (const element of result) {
            const planned = addrs[element.addr] ? addrs[element.addr].planned : ethers.BigNumber.from(0);
            if (addrs[element.addr] && addrs[element.addr].saved !== element.saved) 
                console.log('Something wrong... saved data is not same.');
            addrs[element.addr] = { saved: element.saved, planned: planned.add(ethers.BigNumber.from(element.planned)) };
        }
      }
      if (i == 6)
        i = 19; // 테스트용으로 JUMP (다 실행하면 오래 걸리기도 하고 메모리가 못 버텨서 죽음...)
    }
        
    console.log(addrs);

    for (const [addr, value] of Object.entries(addrs)) {
        if (!value.planned.eq(value.saved)) {
            console.log('Something wrong...');
            console.log(value);
        }
    }

    const result = await checkAllTransferred();
    console.log(`Check Done: ${result}`);
  });
});