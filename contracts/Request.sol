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

    Request[] requests;
    uint256 bookmark; // next index of request array to continue reading

    address token;

    constructor(address _token) {
        token = _token;
        bookmark = 0;
    }

    // make request for exchanging from game currency to corresponding token
    function requestMint(string memory _gameID, uint256 _amount) public returns (uint256) {
        Request memory request;
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = true;
        request.accepted = false;

        requests.push(request);
        return requests.length;
    }

    // make request for exchanging from token to coreesponding game currency
    function requestBurn(string memory _gameID, uint256 _amount) public returns (uint256) {
        Request memory request;
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = false;
        request.accepted = false;

        requests.push(request);
        return requests.length;
    }

    // fetch infos of unread requests
    function read() public returns (uint256, string[] memory, uint256[] memory, bool[] memory) {
        uint256 len = requests.length;
        uint256 cnt = len - bookmark;
        require(cnt > 0, "RequestManager: Nothing to read");
        string[] memory gameID_ = new string[](cnt);
        uint256[] memory amount_ = new uint256[](cnt);
        bool[] memory mint_ = new bool[](cnt);

        uint256 first = bookmark;
        for (uint i = 0; i < cnt; i++) {
            Request storage request = requests[i + first];
            gameID_[i] = request.gameID;
            amount_[i] = request.amount;
        }

        bookmark = len;
        return (first, gameID_, amount_, mint_);
    }

    // accept valid exchange requests
    // param reqeustIDs contains request Ids to accept
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