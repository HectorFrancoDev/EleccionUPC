const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'enough rigid social charge used upset brisk helmet armor kingdom aerobic device';

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    wifi: {
      host: '192.168.1.217',
      port: 7545,
      network_id: 5777,
      gas: 5000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/13efb76ae73b4db69ca04fe9583467b3'),
      network_id: 4,
    }
  }
}