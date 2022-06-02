// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC20Example.sol';
import './interfaces/IERC20Example.sol';

contract RequestManager {
    struct Request {
        address owner;
        uint256 amount;
        string gameID;
        bool mint;
        bool valid;
    }

    Request[] private requests;
    uint256 private bookmark; // next index of request array to continue reading

    address private token;

    function init(address _token) public virtual {
        require(token == address(0), "RequestManager: already initialized");
        token = _token;
        bookmark = 0;
    }

    // make request for exchanging from game currency to corresponding token
    function requestMint(string memory _gameID, uint256 _amount) public {
        require(_amount > 0, "RequestManager: request amount should not be 0");

        Request memory request;
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = true;
        request.valid = false;

        requests.push(request);
    }

    // make request for exchanging from token to coreesponding game currency
    function requestBurn(string memory _gameID, uint256 _amount) public {
        require(_amount > 0, "RequestManager: request amount should not be 0");
        ERC20Example(token).burn(msg.sender, _amount);

        Request memory request;
        request.owner = msg.sender;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = false;
        request.valid = true;

        requests.push(request);
    }

    // fetch info of request of given index
    function getRequest(uint256 index) public view returns (string memory, uint256, bool) {
        Request storage request = requests[index];
        return (request.gameID, request.amount, request.mint);
    }

    // fetch info of unread requests
    function read() public view returns (uint256, string[] memory, uint256[] memory, bool[] memory) {
        return readFrom(bookmark);
    }

    // fetch unread info from given first index
    function readFrom(uint256 first) public view returns (uint256, string[] memory, uint256[] memory, bool[] memory) {
        uint256 len = requests.length;
        uint256 cnt = len - first;
        require(cnt > 0, "RequestManager: Nothing to read");
        string[] memory gameID_ = new string[](cnt);
        uint256[] memory amount_ = new uint256[](cnt);
        bool[] memory mint_ = new bool[](cnt);

        for (uint256 i = 0; i < cnt; i++) {
            Request storage request = requests[i + first];
            gameID_[i] = request.gameID;
            amount_[i] = request.amount;
        }

        return (first, gameID_, amount_, mint_);
    }

    // must updated after reading infos of requests until new bookmark
    function updateBookmark(uint256 newBookmark) public {
        require(bookmark < newBookmark, "RequestManager: bookmark cannot be decreased");
        bookmark = newBookmark;
    }

    // accept valid mint requests
    // param mintReqeustIDs contains indices of requests array to accept
    function accept(uint256[] memory mintRequestIDs) public {
        uint256 cnt = mintRequestIDs.length;
        address[] memory receivers = new address[](cnt);
        uint256[] memory amounts = new uint256[](cnt);

        for(uint256 i = 0; i < cnt; i++) {
            Request storage request = requests[mintRequestIDs[i]];
            require(request.mint && !request.valid, "RequestManager: request with invalid state exists");

            receivers[i] = request.owner;
            amounts[i] = request.amount;

            request.valid = true;
        }

        ERC20Example(token).mintAll(receivers, amounts);
    }

    // reject invalid burn requests
    // param burnRequestIDs contains indices of requests array to reject
    function reject(uint256[] memory burnRequestIDs) public {
        uint256 cnt = burnRequestIDs.length;
        address[] memory receivers = new address[](cnt);
        uint256[] memory amounts = new uint256[](cnt);

        for(uint i = 0; i < cnt; i++) {
            Request storage request = requests[burnRequestIDs[i]];
            require(!request.mint && request.valid, "RequestManager: request with invalid state exists");

            receivers[i] = request.owner;
            amounts[i] = request.amount;

            request.valid = false;
        }

        ERC20Example(token).mintAll(receivers, amounts);
    }

    // retrieve unread burn request
    function retreive(uint256 index) public {
        require(index >= bookmark, "RequestManager: request is already read");
        Request storage request = requests[index];
        require(msg.sender == request.owner, "RequestManager: no permission");
        require(!request.mint && request.valid, "RequestManager: invalid request state");

        request.valid = false;
        ERC20Example(token).mint(request.owner, request.amount);
    }

}