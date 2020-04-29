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

    rinkeby: {
      provider: () => new HDWalletProvider
        (
          mnemonic,
          'https://mainnet.infura.io/v3/c421febee05a404b928dd820089ff157'
        ),
      network_id: 4,
      gas: 4000000,
      from: '0xA7B488037c70a5C620982615C4B01F6c5d501c9D'
    }
  }
}