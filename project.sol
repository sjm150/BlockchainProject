// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// game사가 exchanger의 game ID를 모른다는 가정 하에 코드를 작성했습니다.

// user가 홈페이지에서 coin으로 바꿔달라고 request했을 때, contract
contract exchange_to_coin is ERC1155 {
    
    address private _exchanger_gameID; // user의 game ID
    mapping (address => uint256) private _balances_in_game; // user의 game 내 money. 이거는 game사랑 모종의 방법으로 협약을 맺어서 우리가 그 정보를 알 수 있다고 가정.
    bool private __agree=false;
    uint8 fee=3; // 수수료를 3%로 생각하자

    address _exchanger;
    uint256 _amount; // 얼마나 coin 으로 바꿀 것인가
    bool _agree=false; // game user가 transaction에 동의하는가
    uint transaction_happend_time;
    uint time_limit=5 minutes;
    string uri;

    mapping (address => uint256) _balances; // 메타마스크 계좌

    
    constructor (uint256 amount, string memory uri_) ERC1155(uri_){
        require(_balances_in_game[_exchanger_gameID]*(1-fee/100)>amount, "You don't have enough money");
        _amount=amount;
        uri=uri_;
        _exchanger=msg.sender;
        Timestamp();
    }

    function Timestamp() public{
        transaction_happend_time=block.timestamp;
    }

    function TimestampPassed() public view returns (bool){
        return (block.timestamp<=(transaction_happend_time+time_limit));
    }

    // game user가 game에서 내가 발생시킨 transaction이 맞다고 인정하는 버튼을 누르면 agree값에 true가 들어가는 거로
    function agreement(bool agree) public{
        require(TimestampPassed()==true); // coin으로 바꿔달라는 요청을 하고 5분 안에 game에서 ok를 하지 않으면 transaction 자동으로 거부시킴
        _agree=agree;
    }

    function mint_request() internal virtual returns(bool){
        require(__agree=true);
        require(_exchanger != address(0), "ERC20: mint to the zero address");
        require(_agree=true, "You rejected to make your game money to coin");
        
        return true;
    }

}

// 회사에서는 exchanger의 game id는 모르고 계좌만 아는 상태로 coin 발행
contract company is exchange_to_coin{

    constructor() exchange_to_coin(_amount, uri){}
    function mint() public virtual {
        if(mint_request()==true)
            _balances[_exchanger]+=_amount;
    }

}