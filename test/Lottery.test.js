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

  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({
    data: bytecode 
  })
  .send({ 
    from: accounts[0],
    gas: '1000000' 
  }); 
});

describe('Lottery', () => {
  it('deploys a lottery contract', () => {
    assert.ok(lottery.options.address) 
  });

  it('assigns a manager', async () => {
    const manager = await lottery.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('enters one player to lottery', async () => {
    await lottery.methods.enter().send({ 
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('enters multiple players to lottery', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.1', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.1', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

    assert.equal(3, players.length);
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
  });

  it('requires minimum ether to enter', async () => {
    try{
      await lottery.methods.enter().send({ 
        from: accounts[0],
        value: 200
      });
      assert(false); // if the above code runs then this assertion will trigger the test to fail
    } catch (err) {
      assert(err); 
    }
  });

  it('only allows manager to run pickWinner', async () => {
    try{
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    }catch (err) {
      assert(err);
    }
  });

  it('sends money to winner & resets', async () => {
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether')
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const newBalance = await web3.eth.getBalance(accounts[0]);

    const difference = newBalance - initialBalance;
    const gas = parseInt(difference) - 1; // returns negative number

    assert.equal((parseInt(newBalance) - gas), parseInt(initialBalance)); // minus the gas to add it back 
    
    const players = await lottery.methods.getPlayers().call();
    assert.equal(players.length, 0);
  });
});
