// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC20Example.sol';
import './Request.sol';
import '@openzeppelin/contracts/proxy/Clones.sol';

// clone factory for tokens & corresponding request managers
contract Factory {

    // zero index elements are library for clones
    address[] public tokens;
    address[] public requests;

    event RequestTokenCreated(address request, address token, uint256 index);

    constructor() {
        address token = address(new ERC20Example("", ""));
        address request = address(new RequestManager());
        ERC20Example(token).init("Library", "LIB", 0, request);
        RequestManager(request).init(token, msg.sender);
        tokens.push(token);
        requests.push(request);
    }

    function createToken(string memory name, string memory symbol, uint8 decimals) public {
        address token = Clones.clone(tokens[0]);
        address request = Clones.clone(requests[0]);
        ERC20Example(token).init(name, symbol, decimals, request);
        RequestManager(request).init(token, msg.sender);
        tokens.push(token);
        requests.push(request);

        emit RequestTokenCreated(request, token, tokens.length - 1);
    }

    function getTokenAddress(uint256 idx) public view returns (address token) {
        token = tokens[idx];
    }

    function getRequestAddress(uint256 idx) public view returns (address request) {
        request = requests[idx];
    }

}