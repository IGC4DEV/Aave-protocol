pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import {IPermissionManager} from '../../interfaces/IPermissionManager.sol';
import {PermissionedLendingPool} from './PermissionedLendingPool.sol';

contract CasinoPermissionedLendingPool is PermissionedLendingPool{

    function deposit(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode
    )
    public
    virtual
    override
    {
        uint256[] memory new_role_depositor = new uint256[](1);
        address[] memory user = new address[](1);
        //set depositor role
        new_role_depositor[0] = 0;
        //set user address
        user[0] = msg.sender;

        //Add user as new depositor
        IPermissionManager(_addressesProvider.getAddress(PERMISSION_MANAGER)).addPermissions(new_role_depositor, user);
        super.deposit(asset, amount, onBehalfOf, referralCode);
    }
}