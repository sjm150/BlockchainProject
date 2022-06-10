// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Example is ERC20 {

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    address private request;

    // constructor for index 0
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function init(string memory name_, string memory symbol_, uint8 decimals_, address request_) public {
        require(request == address(0), "Token: already initialized");
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        request = request_;
    }

    function mint(address receiver, uint256 amount) public {
        require(msg.sender == request, "Token: no permission");
        super._mint(receiver, amount);
    }

    function mintAll(address[] memory receivers, uint256[] memory amounts) public {
        require(msg.sender == request, "Token: no permission");
        for(uint256 i = 0; i < receivers.length; i++) {
            super._mint(receivers[i], amounts[i]);
        }
    }

    function burn(address owner, uint256 amount) public {
        require(msg.sender == request, "Token: no permission");
        super._burn(owner, amount);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

}