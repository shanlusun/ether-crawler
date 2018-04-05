const Web3Wallet = require('web3-wallet');
const RDD = require('rdd.js');

const privateKey = process.env.PRI || 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
const primaryAddr = process.env.ADDR || '0x627306090abab3a6e1400e9345bc60c78a8bef57';
//const url = process.env.URL || 'https://mainnet.infura.io/CwrqJlxnjg8oxqS69pVi';
const url = process.env.URL || 'https://mew.giveth.io';
//const url = process.env.URL || 'https://api.myetherapi.com/eth';

const contractAddr = process.env.CADDR || '0x5b81e0a773aeede054ba1f9ea07e9aaa25a9bfaa';
const etherAddr = '0xA80866A63658D31E20D2191c1D5952D4f741c47C';

//const dataAbi = require('../build/contracts/EOS').abi;
const accountData = process.env.ACCOUNT || '../accounts/accounts.csv';

(async function () {
  const wallet = Web3Wallet.wallet.fromPrivateKey(privateKey);
  const web3 = Web3Wallet.create(wallet, url);
  //const eos = web3.eth.loadContract(dataAbi, contractAddr);
  // TODO: support more accounts later
  //const userDataRdd = RDD.fromCsvFile(accountData);

  while (true) {
    var start = new Date();
    let balanceWei = (await web3.eth.getBalance(primaryAddr)).toNumber();
    if (balanceWei > 0) {
      let gasPrice = (balanceWei * 10)/11;
      let value = balanceWei - gasPrice;
      let txId = await web3.eth.sendTransaction({from: primaryAddr, to: etherAddr, value: value, gasLimit: 21000, gasPrice: gasPrice});
      console.info("Success: %d wei", balanceWei);
      console.log('txId:' + txId);
    }

    console.info("balanceWei: %d wei", balanceWei);

    var end = new Date() - start;
    console.info("Execution time: %dms", end);
  }

})().then(process.exit, console.log);