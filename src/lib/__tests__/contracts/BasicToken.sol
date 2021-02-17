// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BasicToken is ERC20 {
  constructor(uint256 initialBalance, string memory name, string memory symbol) ERC20(name, symbol) {
      _mint(msg.sender, initialBalance);
  }
}