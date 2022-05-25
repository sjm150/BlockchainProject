// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IERC20Example.sol';
import './Request.sol';

// request를 바탕으로 Token 생성
contract Token is RequestManager{

    mapping (address => mapping(address => uint256)) _balances; // userID->tokenAddress->잔고
    string[] private request_userID; // 회사가 읽은 data까지의 userID를 모은 배열
    uint256[] private _amount; // 각 request별로 얼마나 mint 혹은 burn 할 것인지

    // coin을 mint하거나 burn하면 game money가 증가 혹은 감소할 수도 있는데 이는 어떻게 구현?

    constructor() RequestManager(token){
        (bookmark, request_userID, _amount)=read();
    }

    function mint() external returns (bool accepted){
        uint temp=0;
        uint num_of_mint_require=0;
        accepted=false;
        for(uint i=bookmark; i<bookmark+request_userID.length;i++){
            if(requests[i].mint==true){
                ++num_of_mint_require;
            }
            require(requests[i].owner!=address(0), "Not a valid address");
            require(requests[i].mint==true);
            require(requests[i].amount>=0);

            _balances[requests[i].owner][token]+=requests[i].amount;
            requests[i].accepted=true;
            temp++;
        }
        if(temp==num_of_mint_require)
            accepted=true;
        // 모두 성공적으로 잘 mint 되었으면 true를 return
    }

    function burn() external returns (bool accepted){
        uint temp=0;
        uint num_of_burn_require=0;
        accepted=false;
        for(uint i=bookmark; i<bookmark+request_userID.length;i++){
            if(requests[i].mint==false){
                ++num_of_burn_require;
            }
            require(requests[i].owner!=address(0), "Not a valid address");
            require(requests[i].mint==false);
            require(requests[i].amount>=0);

            _balances[requests[i].owner][token]-=requests[i].amount;
            requests[i].accepted=true;
            temp++;
        }
        if(temp==request_userID.length)
            accepted=true;
        // 모두 성공적으로 잘 burn 되었으면 true를 return
    }
}