// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.4.1/utils/Context.sol";
import "@openzeppelin/contracts@4.4.1/access/Ownable.sol";

interface ERC20Contract {
    function allowance(address owner, address spender) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract BatchTransfer is Ownable {
    ERC20Contract _tokenContract;

    constructor(address erc20Contract) {
        _tokenContract = ERC20Contract(erc20Contract);
    }

    function tokenContract() public view returns (address) {
        return address(_tokenContract);
    }

    function batchTransferFrom(address from, address[] memory to, uint256[] memory amount) public onlyOwner {
        require(to.length > 0, "To list is empty.");
        require(amount.length > 0, "Amount list is empty.");
        require(amount.length == to.length, "The two lists have different lengths.");

        for(uint i = 0; i < to.length; i++) {
            _batchTransferFrom(from, to[i], amount[i]);
            emit BatchTransferred(to[i], amount[i]);
        }
    }

    function _batchTransferFrom(address from, address to, uint256 amount) internal returns(bool) {
        return _tokenContract.transferFrom(from, to, amount);
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _tokenContract.allowance(owner, spender);
    }
    
    event BatchTransferred(address _receiver, uint256 _amount);    
}