pragma solidity ^0.4.25;

contract Lottery {
  address[] public players;
  address public manager;

  constructor() public payable {
    manager = msg.sender; // whomever called this function is the manager
  }

  function enter() public payable {
    require(msg.value > 0.01 ether);

    players.push(msg.sender);
  }

  //only pseudo random this contract could not be used in practice, purely for dev purposes
  function random() view private returns (uint){
    return uint(keccak256(block.difficulty, now, players.length));
  }

  function pickWinner() public restricted {

    uint index = random() % players.length;
    players[index].transfer(address(this).balance);
    players = new address[](0);
  }

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  function getPlayers() view returns(address[]) {
    return players;
  }
}