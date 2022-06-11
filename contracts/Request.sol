// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC20Example.sol';

contract RequestManager {
    struct Request {
        uint256 amount;
        address owner;
        bool mint;
        bool valid;
    }

    // mapping user address => user's game ID
    mapping(address => string) private gameIDs;

    Request[] private requests;
    uint256 public bookmark; // next index of request array to continue reading

    address public token;
    address public gameManager;

    // request events
    event RequestCreated(uint256 indexed requestIndex, address indexed owner, string gameID, uint256 amount, bool mint);
    event MintRequestAccepted(uint256[] requestIndices, address[] owners);
    event BurnRequestRejected(uint256[] requestIndices, address[] owners);
    event BurnRequestRetrieved(uint256 indexed requestIndex, address indexed owner, uint256 amount);

    function init(address _token, address _gameManager) public virtual {
        require(token == address(0), "Already initialized");
        token = _token;
        gameManager = _gameManager;
        bookmark = 0;
    }

    function setGameID(string calldata _gameID) internal {
        gameIDs[msg.sender] = _gameID;
    }

    function getGameID() external view returns (string memory) {
        return gameIDs[msg.sender];
    }

    // make request for exchanging from game currency to corresponding token
    function requestMint(uint256 _amount) public {
        require(_amount > 0, "Request amount should not be 0");
        string storage gameID = gameIDs[msg.sender];
        require(bytes(gameIDs[msg.sender]).length != 0, "Set gameID for this address");

        Request memory request;
        request.amount = _amount;
        request.owner = msg.sender;
        request.mint = true;
        request.valid = false;

        requests.push(request);

        emit RequestCreated(requests.length - 1, msg.sender, gameID, _amount, true);
    }
    // set & request in 1 tx
    function setAndRequestMint(string calldata _gameID, uint256 _amount) public {
        setGameID(_gameID);
        requestMint(_amount);
    }

    // make request for exchanging from token to coreesponding game currency
    function requestBurn(uint256 _amount) public {
        require(_amount > 0, "Request amount should not be 0");
        string storage gameID = gameIDs[msg.sender];
        require(bytes(gameIDs[msg.sender]).length != 0, "Set gameID for this address");

        ERC20Example(token).burn(msg.sender, _amount);

        Request memory request;
        request.amount = _amount;
        request.owner = msg.sender;
        request.mint = false;
        request.valid = true;

        requests.push(request);

        emit RequestCreated(requests.length - 1, msg.sender, gameID, _amount, false);
    }
    // set & request in 1 tx
    function setAndRequestBurn(string calldata _gameID, uint256 _amount) public {
        setGameID(_gameID);
        requestBurn(_amount);
    }

    // fetch info of request of given index
    function read(uint256 index) public view returns (string memory, Request memory) {
        return (gameIDs[msg.sender], requests[index]);
    }

    // fetch info of all unread requests
    function readAll() public view returns (uint256, string[] memory, Request[] memory) {
        return readFrom(bookmark);
    }

    // fetch unread info from given first index
    function readFrom(uint256 first) public view returns (uint256, string[] memory, Request[] memory) {
        require(msg.sender == gameManager, "No permission");
        uint256 len = requests.length;
        uint256 cnt = len - first;
        require(cnt > 0, "Nothing to read");

        string[] memory gameIDs_ = new string[](cnt);
        Request[] memory requests_ = new Request[](cnt);

        for (uint256 i = 0; i < cnt; i++) {
            gameIDs_[i] = gameIDs[msg.sender];
            requests_[i] = requests[i + first];
        }

        return (first, gameIDs_, requests_);
    }

    // must update after reading infos of requests until new bookmark
    function updateBookmark(uint256 newBookmark) public {
        require(msg.sender == gameManager, "No permission");
        require(bookmark < newBookmark, "Bookmark cannot be decreased");
        bookmark = newBookmark;
    }

    // accept valid mint requests
    // param mintReqeustIDs contains indices of requests array to accept
    function accept(uint256[] calldata mintRequestIDs) public {
        require(msg.sender == gameManager, "No permission");

        uint256 cnt = mintRequestIDs.length;
        address[] memory receivers = new address[](cnt);
        uint256[] memory amounts = new uint256[](cnt);

        for(uint256 i = 0; i < cnt; i++) {
            Request storage request = requests[mintRequestIDs[i]];
            require(request.mint && !request.valid, "Request with invalid state exists");

            receivers[i] = request.owner;
            amounts[i] = request.amount;

            request.valid = true;
        }

        ERC20Example(token).mintAll(receivers, amounts);

        emit MintRequestAccepted(mintRequestIDs, receivers);
    }

    // reject invalid burn requests
    // param burnRequestIDs contains indices of requests array to reject
    function reject(uint256[] memory burnRequestIDs) public {
        require(msg.sender == gameManager, "No permission");

        uint256 cnt = burnRequestIDs.length;
        address[] memory receivers = new address[](cnt);
        uint256[] memory amounts = new uint256[](cnt);

        for(uint i = 0; i < cnt; i++) {
            Request storage request = requests[burnRequestIDs[i]];
            require(!request.mint && request.valid, "Request with invalid state exists");

            receivers[i] = request.owner;
            amounts[i] = request.amount;

            request.valid = false;
        }

        ERC20Example(token).mintAll(receivers, amounts);

        emit BurnRequestRejected(burnRequestIDs, receivers);
    }

    // retrieve unread burn request
    function retreive(uint256 index) public {
        require(index >= bookmark, "Request is already read");
        Request storage request = requests[index];
        require(msg.sender == request.owner, "No permission");
        require(!request.mint && request.valid, "Invalid request state");

        request.valid = false;
        uint256 amount = request.amount;
        ERC20Example(token).mint(msg.sender, amount);

        emit BurnRequestRetrieved(index, msg.sender, amount);
    }

}