// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CASTPrice
 * @dev Store & retrieve price of Casino Token
 */
contract BasicTokenPriceOracle is Ownable {

    uint256 price;

    /**
     * @dev Store value in variable
     * @param _price value to store
     */
    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    /**
     * @dev Return value 
     * @return value of 'price'
     */
    function getPrice() public view returns (uint256){
        return price;
    }
}