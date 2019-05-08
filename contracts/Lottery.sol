pragma solidity ^ 0.4.25;

contract Lottery {
  address[] public players;
  address public manager;

  function Lottery() public payable {
    manager = msg.sender; // whomever called this function is the manager
  }

  function enter() public payable {
    require(msg.value > 0.1);

    players.push(msg.sender);
  }

  function random() view private returns (uint){
    return uint(sha3(block.difficulty, now, players.length));
  }

  function pickWinner() public restricted {

    uint index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0);
  }

  modifier restricted() {
    require(msg.sender = manager);
    _;
  }

  function getPlayers() view returns(address[]) {
    return players;
  }
}