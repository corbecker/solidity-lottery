const { interface, bytecode } = require('./compile');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "fan moment mention interest drift jar quantum science lawsuit reject polar narrow";

const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/855f3d0ec061407ca8b317fa013c5ae6');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode })
    .send({ from: accounts[0]})
  
  console.log(interface);
  console.log('Contract deployed to', result.options.address);
}
deploy();