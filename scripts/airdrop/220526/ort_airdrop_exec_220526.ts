const { initialize, airdropTransfer } = require("ort_airdrop_func_220526");

(async () => {
  try {
    // Rinkeby
    // const tokenAddress = '0x5c59a5B139B0538CB106D775a022caD98Dd14b5a';
    // const batchTransferAddress = '0x72E8E4Ec2733Ac689799A773448f40bf0c41C1F2';
    // const fromAddress = '0xE199C9e8C738BCd2b36Aff18D0F41f3E39eEAdDf';

    // Mainnet
    const tokenAddress = '0x5c59a5B139B0538CB106D775a022caD98Dd14b5a';
    const batchTransferAddress = '0x3538e7282A34824A341c58070F9034A8b4Cc9A78';
    const fromAddress = '0x9744De355E38C8Dc377D5DE95D328f75B0375809';

    initialize(tokenAddress, batchTransferAddress, fromAddress);

    for (let i = 0; i < 21; i++) {
      console.log(`Try ${i}...`);
      const result = await airdropTransfer(i);
      console.log(result);
      if (!result) break;
    }

    console.log('Done!');
  } catch (e) {
    console.log(e.message);
  }
})()