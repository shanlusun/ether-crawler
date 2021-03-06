const Web3Wallet = require('web3-wallet');
const RDD = require('rdd.js');

const privateKey = process.env.PRI || 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
const primaryAddr = process.env.ADDR || '0x627306090abab3a6e1400e9345bc60c78a8bef57';
//main network
const url = process.env.URL || 'https://mew.giveth.io';
//const url = process.env.URL || 'https://mainnet.infura.io/CwrqJlxnjg8oxqS69pVi';
//const url = process.env.URL || 'https://api.myetherapi.com/eth';

//const urlArray = ['https://mew.giveth.io', 'https://mainnet.infura.io/CwrqJlxnjg8oxqS69pVi', 'https://api.myetherapi.com/eth', 'https://mainnet.infura.io/metamask'];
const urlArray = ['https://mew.giveth.io', 'https://mainnet.infura.io/CwrqJlxnjg8oxqS69pVi', 'https://mainnet.infura.io/metamask'];

//ropsten testnet
//const url = process.env.URL || 'https://ropsten.infura.io/CwrqJlxnjg8oxqS69pVi';

//const contractAddr = process.env.CADDR || '0x5b81e0a773aeede054ba1f9ea07e9aaa25a9bfaa';
const etherAddr = '0xA80866A63658D31E20D2191c1D5952D4f741c47C';
//const etherAddr = '0x39277F3D6CFFbD59ed5178c3008feC4DFa100433';

const rate = process.env.RATE || 11;

//const dataAbi = require('../build/contracts/EOS').abi;
//const accountData = process.env.ACCOUNT || '../accounts/accounts.csv';



async function check () {

}

(async function () {
  const wallet = Web3Wallet.wallet.fromPrivateKey(privateKey);
  //const web3 = Web3Wallet.create(wallet, url);

  //const eos = web3.eth.loadContract(dataAbi, contractAddr);
  // TODO: support more accounts later
  //const userDataRdd = RDD.fromCsvFile(accountData);

  let count = 0;
  const web3Array = [];

  for (var i = 0; i < urlArray.length; i++) {
    const web3 = Web3Wallet.create(wallet, urlArray[i]);
    web3Array.push(web3);
  }


  while (true) {

    for (var i = 0; i < web3Array.length; i++) {
      var start = new Date();

      try {
        let balanceWei = (await web3Array[i].eth.getBalance(primaryAddr)).toNumber();
        if (balanceWei > 1e13) {
          console.log('balanceWei:' + balanceWei);
          let gas = Math.ceil(balanceWei * (rate - 1)/rate);
          let gasLimit = 21000;
          let gasPrice = Math.floor(gas/gasLimit);

          let valueWei = balanceWei - gas;

          web3Array[i].eth.sendTransaction({from: primaryAddr, to: etherAddr, value: valueWei, gasLimit: gasLimit, gasPrice: gasPrice},
              function(err, transactionHash) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('transactionHash:' + transactionHash);
                  console.log("Success! balanceWei: %d wei, valueWei: %d wei", balanceWei, valueWei);
                }
              });

        }
      } catch(e) {
        console.log(e);
      }

      //console.info("balanceWei: %d wei", balanceWei);
      count ++;
      if (count % 10 === 0) {
        var end = new Date() - start;
        console.log(urlArray[i], "Execution time: %dms, count: %d", end, count);
      }
    }
  }

})().then(process.exit, console.log);