// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20Example {

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mint() external returns (bool);

    function burn() external returns (bool);
    
}

contract RequestManager {
    struct Request {
        address owner;
        uint256 amount;
        string gameID;
        bool mint;
        bool accepted;
    }

    Request[] requests;
    uint256 bookmark;
    address token;
    bool exist_mint_request=false;
    bool exist_burn_request=false;

    //Request[] request_user;

    constructor(address _token) {
        token = _token;
        bookmark = 0;
    }

    function requestMint(string memory _gameID, address _address, uint256 _amount) public {
        require(_amount>0, "Write more than 0");
        Request memory request;
        request.owner = _address;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = true;
        request.accepted = false;

        exist_mint_request=true;

        requests.push(request);
    }

    function requestBurn(string memory _gameID, address _address, uint256 _amount) public {
        require(_amount>0, "Write more than 0");
        require(_balances[_address][token]>_amount, "You don't have enough token");
        Request memory request;
        request.owner = _address;
        request.gameID = _gameID;
        request.amount = _amount;
        request.mint = false;
        request.accepted = false;

        exist_burn_request=true;

        requests.push(request);
    }

    mapping (address => mapping(address => uint256)) _balances; // userID->tokenAddress->잔고
    //uint256 request_number; // 처리해야 하는 request 수
    uint256 cnt;
    uint256 first;

    function Convert_to_Token() public {
        read();
        if(exist_mint_request==true)
            mint();
        if(exist_burn_request==true)
            burn();
        
        //delete request_user;
        exist_mint_request=false;
        exist_burn_request=false;
    }

    function mint() public {
        
        for(uint i=0; i<cnt;i++){
            
            require(requests[i+first].mint==true);    

            _balances[requests[i+first].owner][token]+=requests[i+first].amount;
            requests[i+first].accepted=true;
        }
    }

    function burn() public {
        
        for(uint i=0; i<cnt;i++){
            
            require(requests[i+first].mint==false);
            require(_balances[requests[i+first].owner][token]>requests[i+first].amount);
            _balances[requests[i+first].owner][token]-=requests[i+first].amount;
            requests[i+first].accepted=true;
        }
    }

    function read() public {
        uint256 len = requests.length;
        cnt = len - bookmark;
        require(cnt > 0, "RequestManager: Nothing to read");

        first = bookmark;

        bookmark = len;
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

    // 프로그램이 잘 동작하는지 확인하기 위한 함수
    function balenceof(address _address) public view returns (uint256){
        return _balances[_address][token];
    }
}
