// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IERC20Example.sol';

contract RequestManager {
    struct Request {
        address owner;
        uint256 amount;
        string gameID;
        bool mint;
        bool accepted;
    }

    Request[] private requests;
    uint256 private nonce;
    uint256 private bookmark;

    address private token;

    constructor(address _token) {
        token = _token;
        nonce = 0;
        bookmark = 0;
    }

    function requestMint(string memory _gameID, uint256 _amount) public returns (uint256 requestID) {
        requestID = nonce++;
        Request storage request = requests[requestID];
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = true;
        request.accepted = false;
    }

    function requestBurn(string memory _gameID, uint256 _amount) public returns (uint256 requestID) {
        requestID = nonce++;
        Request storage request = requests[requestID];
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = false;
        request.accepted = false;
    }

    function read() public returns (uint256, string[] memory, uint256[] memory) {
        uint256 cnt = nonce - bookmark;
        string[] memory gameID_ = new string[](cnt);
        uint256[] memory amount_ = new uint256[](cnt);

        uint256 first = bookmark;
        for (uint i = 0; i < cnt; i++) {
            Request storage request = requests[i + first];
            gameID_[i] = request.gameID;
            amount_[i] = request.amount;
        }

        bookmark = nonce;
        return (first, gameID_, amount_);
    }

    function accept(uint256[] memory requestIDs) public returns (bool[] memory) {
        bool[] memory result = new bool[](requestIDs.length);

        for(uint i = 0; i < requestIDs.length; i++) {
            Request storage request = requests[requestIDs[i]];
            (bool success, bytes memory data) = request.mint ?
                token.call(abi.encodeWithSelector(IERC20Example.mint.selector, request.owner, request.amount)):
                token.call(abi.encodeWithSelector(IERC20Example.burn.selector, request.owner, request.amount));

            requests[requestIDs[i]].accepted = result[i] = success && (data.length == 0 || abi.decode(data, (bool)));
        }

        return result;
    }
}