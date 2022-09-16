// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';

interface ICasinoTokenPrice {
  function getPrice() external view returns (uint256);
}

/**
  This acts as a fallback oracle for the real world tokens
 */
contract CasinoMarketOracle is IPriceOracleGetter, Ownable {
  using SafeMath for uint256;

  event AssetConfigUpdated(address indexed asset, address indexed source, address indexed currency);

  // assetsSources are the assessor contract addresses.
  mapping(address => ICasinoTokenPrice) public assetsSources;

  // assetsCurrencies are the currencies in which each token is denominated.
  mapping(address => address) public assetsCurrencies;

  // aaveOracle is the address of the deployed AaveOracle contract.
  address private aaveOracle;

  /// @notice External function called by the Aave governance to set or replace the Aave oracle address
  /// @param _aaveOracle The address of the aave oracle
  function setAaveOracle(address _aaveOracle) external onlyOwner {
    aaveOracle = _aaveOracle;
  }

  /// @notice External function called by the Aave governance to set or replace sources of assets
  /// @param assets The addresses of the assets
  /// @param sources The address of the source of each asset
  /// @param currencies The address of the currency of each asset
  function setAssetConfig(
    address[] memory assets,
    address[] memory sources,
    address[] memory currencies
  ) external onlyOwner {
    require(
      assets.length == sources.length && assets.length == currencies.length,
      'INCONSISTENT_PARAMS_LENGTH'
    );

    for (uint256 i = 0; i < assets.length; i++) {
      assetsSources[assets[i]] = ICasinoTokenPrice(sources[i]);
      assetsCurrencies[assets[i]] = currencies[i];
      emit AssetConfigUpdated(assets[i], sources[i], currencies[i]);
    }
  }

  /// @notice Gets an asset price by address
  /// @param asset The asset address
  function getAssetPrice(address asset) public view override returns (uint256) {
    ICasinoTokenPrice source = assetsSources[asset];
    address currency = assetsCurrencies[asset];
    require(address(source) != address(0) && currency != address(0), 'invalid-asset');
    uint256 currencyPrice = IPriceOracleGetter(aaveOracle).getAssetPrice(currency);
    return source.getPrice().mul(currencyPrice);
  }
}