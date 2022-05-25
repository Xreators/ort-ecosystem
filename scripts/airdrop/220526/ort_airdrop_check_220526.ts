const { initialize, checkTransferResult, checkAllTransferred } = require("ort_airdrop_func_220526");

(async () => {
  try {
    // Rinkeby
    // const tokenAddress = '0x5c59a5B139B0538CB106D775a022caD98Dd14b5a';
    // const batchTransferAddress = '0x72E8E4Ec2733Ac689799A773448f40bf0c41C1F2';
    // const fromAddress = '0xE199C9e8C738BCd2b36Aff18D0F41f3E39eEAdDf';

    // Mainnet
    const tokenAddress = '0x5c59a5B139B0538CB106D775a022caD98Dd14b5a';
    const batchTransferAddress = '0x3538e7282A34824A341c58070F9034A8b4Cc9A78';
    const fromAddress = '0x9744de355e38c8dc377d5de95d328f75b0375809';

    const addrs= {};

    initialize(tokenAddress, batchTransferAddress, fromAddress);

    for (let i = 0; i < 21; i++) {
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

  } catch (e) {
    console.log(e.message);
  }
})()