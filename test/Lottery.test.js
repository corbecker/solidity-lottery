const Web3 = require('web3');
const ganache = require('ganache-cli');
const { interface, bytecode } = require('../compile');
const assert = require('assert');
const provider = ganache.provider();

const web3 = new Web3(provider);

let lottery;
let accounts;

beforeEach( async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts)

  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({
    data: bytecode 
  })
  .send({ 
    from: accounts[0],
    gas: 1000000 
  }); 
});

describe('Lottery', () => {
  it('creates a lottery', () => {
    assert.ok(lottery.options.address)
  })
});
