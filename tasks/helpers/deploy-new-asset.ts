import { task } from 'hardhat/config';
import { eEthereumNetwork, ICommonConfiguration } from '../../helpers/types';
import * as marketConfigs from '../../markets/casino';
import * as marketCommonsConfigs from '../../markets/casino/commons';
import * as reserveConfigs from '../../markets/casino/reservesConfigs';
import {
  getLendingPoolAddressesProvider,
  getLendingPoolConfiguratorProxy,
  getAaveOracle,
  getCasinoOracle,
} from './../../helpers/contracts-getters';
import { waitForTx, notFalsyOrZeroAddress } from '../../helpers/misc-utils';
import { BigNumberish } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import {
  chooseATokenDeployment,
  deployDefaultReserveInterestRateStrategy,
  deployStableDebtToken,
  deployVariableDebtToken,
} from './../../helpers/contracts-deployments';
import { setDRE } from '../../helpers/misc-utils';
import { ZERO_ADDRESS } from './../../helpers/constants';

const LENDING_POOL_ADDRESS_PROVIDER = {
  main: '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
  kovan: '0x652B2937Efd0B5beA1c8d54293FC1289672AFC6b',
  goerli: '0xBBBcd3ba3c59137978ff5525C0441b7F1Cb7ca5d',
};

const isSymbolValid = (symbol: string, network: eEthereumNetwork) =>
  Object.keys(reserveConfigs).includes('strategy' + symbol) &&
  marketConfigs.AaveCasinoConfig.ReserveAssets[network][symbol] &&
  marketConfigs.AaveCasinoConfig.ReservesConfig[symbol] === reserveConfigs['strategy' + symbol];

task('external:deploy-new-asset', 'Deploy A token, Debt Tokens, Risk Parameters')
  .addParam('symbol', `Asset symbol, needs to have configuration ready`)
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify, symbol }, localBRE) => {
    const network = 'goerli';

    if (!isSymbolValid(symbol, network as eEthereumNetwork)) {
      throw new Error(
        `
WRONG RESERVE ASSET SETUP:
        The symbol ${symbol} has no reserve Config and/or reserve Asset setup.
        update /markets/casino/index.ts and add the asset address for ${network} network
        update /markets/casino/reservesConfigs.ts and add parameters for ${symbol}
        `
      );
    }
    console.log('A');
    await setDRE(localBRE);
    const strategyParams = reserveConfigs['strategy' + symbol];
    const reserveAssetAddress = marketConfigs.AaveCasinoConfig.ReserveAssets[network][symbol];

    // DEPLOY TOKENS

    const deployCustomAToken = chooseATokenDeployment(strategyParams.aTokenImpl);
    console.log('B');
    const addressProvider = await getLendingPoolAddressesProvider(
      LENDING_POOL_ADDRESS_PROVIDER[network]
    );
    console.log('C');
    const poolAddress = '0x228d65503187621807517EaC8ed6FCF88aBb2998'; //await addressProvider.getLendingPool();
    console.log(poolAddress);
    const aToken = await deployCustomAToken(verify);

    console.log('E');
    const stableDebt = await deployStableDebtToken(
      [
        poolAddress,
        reserveAssetAddress,
        ZERO_ADDRESS, // Incentives Controller
        `Aave stable debt bearing ${symbol}`,
        `stableDebt${symbol}`,
      ],
      verify
    );
    console.log('F');
    const variableDebt = await deployVariableDebtToken(
      [
        poolAddress,
        reserveAssetAddress,
        ZERO_ADDRESS, // Incentives Controller
        `Aave variable debt bearing ${symbol}`,
        `variableDebt${symbol}`,
      ],
      verify
    );
    console.log('G');
    const rates = await deployDefaultReserveInterestRateStrategy(
      [
        addressProvider.address,
        strategyParams.strategy.optimalUtilizationRate,
        strategyParams.strategy.baseVariableBorrowRate,
        strategyParams.strategy.variableRateSlope1,
        strategyParams.strategy.variableRateSlope2,
        strategyParams.strategy.stableRateSlope1,
        strategyParams.strategy.stableRateSlope2,
      ],
      verify
    );
    console.log('H');
    console.log(`
    New interest bearing asset deployed on ${network}:
    Interest bearing a${symbol} address: ${aToken.address}
    Variable Debt variableDebt${symbol} address: ${variableDebt.address}
    Stable Debt stableDebt${symbol} address: ${stableDebt.address}
    Strategy Implementation for ${symbol} address: ${rates.address}
    `);

    // INIT RESERVE

    let initInputParams: {
      aTokenImpl: string;
      stableDebtTokenImpl: string;
      variableDebtTokenImpl: string;
      underlyingAssetDecimals: BigNumberish;
      interestRateStrategyAddress: string;
      underlyingAsset: string;
      treasury: string;
      incentivesController: string;
      underlyingAssetName: string;
      aTokenName: string;
      aTokenSymbol: string;
      variableDebtTokenName: string;
      variableDebtTokenSymbol: string;
      stableDebtTokenName: string;
      stableDebtTokenSymbol: string;
      params: BytesLike;
    }[] = [];

    //ReserveFactorTreasuryAddress
    const treasuryAddress =
      marketCommonsConfigs.CommonsConfig.ReserveFactorTreasuryAddress[network];
    const incentivesController = marketCommonsConfigs.CommonsConfig.IncentivesController[network];
    const aTokenNamePrefix = marketCommonsConfigs.CommonsConfig.ATokenNamePrefix;
    const symbolPrefix = marketCommonsConfigs.CommonsConfig.SymbolPrefix;
    const variableDebtTokenNamePrefix =
      marketCommonsConfigs.CommonsConfig.VariableDebtTokenNamePrefix;
    const stableDebtTokenNamePrefix = marketCommonsConfigs.CommonsConfig.StableDebtTokenNamePrefix;
    const decimals = reserveConfigs['strategy' + symbol].decimals;
    console.log(decimals);
    // const aTokenImpl = "0xB9C689AdeCa8B59DFa65Db1F4C22ca2f7cB1bA09"
    // const stableDebtTokenImpl = "0x1037fE5b726cd40F1121dC3aE64a65bE1Ee0aBc3"
    // const variableDebtTokenImpl = "0x54848073DC885D1dF8309975259F2d0B70494BF8"
    // const interestRateStrategyAddress = "0x426f0D744CF4fE62d05693cd791E8b292cA54498"

    initInputParams.push({
      aTokenImpl: aToken.address,
      stableDebtTokenImpl: stableDebt.address,
      variableDebtTokenImpl: variableDebt.address,
      underlyingAssetDecimals: decimals,
      interestRateStrategyAddress: rates.address,
      underlyingAsset: reserveAssetAddress,
      treasury: treasuryAddress,
      incentivesController: incentivesController,
      underlyingAssetName: symbol,
      aTokenName: `${aTokenNamePrefix} ${symbol}`,
      aTokenSymbol: `a${symbolPrefix}${symbol}`,
      variableDebtTokenName: `${variableDebtTokenNamePrefix} ${symbolPrefix}${symbol}`,
      variableDebtTokenSymbol: `variableDebt${symbolPrefix}${symbol}`,
      stableDebtTokenName: `${stableDebtTokenNamePrefix} ${symbol}`,
      stableDebtTokenSymbol: `stableDebt${symbolPrefix}${symbol}`,
      params: '0x10',
    });

    console.log(initInputParams[0]);
    //const configuratorAddress = await addressProvider.getLendingPoolConfigurator();
    const configurator = await getLendingPoolConfiguratorProxy(
      '0xb76C18D61D0760e628545A62FED8332c65747c14'
    );
    console.log('testststststst');

    const tx3 = await configurator.batchInitReserve(initInputParams);

    // ORACLE
    const aaveOracleAddress = await addressProvider.getPriceOracle();
    const aaveOracle = await getAaveOracle(aaveOracleAddress);
    console.log(marketCommonsConfigs.CommonsConfig.ChainlinkAggregator[network][symbol]);

    if (
      notFalsyOrZeroAddress(marketCommonsConfigs.CommonsConfig.ChainlinkAggregator[network][symbol])
    ) {
      const aggregator = marketCommonsConfigs.CommonsConfig.ChainlinkAggregator[network][symbol];
      await waitForTx(await aaveOracle.setAssetSources([reserveAssetAddress], [aggregator]));
    } else if (
      notFalsyOrZeroAddress(marketConfigs.AaveCasinoConfig.AssessorContracts[network][symbol]) &&
      notFalsyOrZeroAddress(marketConfigs.AaveCasinoConfig.AssetCurrencies[network][symbol])
    ) {
      const CasinoOracleAddress = await aaveOracle.getFallbackOracle();
      const CasinoOracle = await getCasinoOracle(CasinoOracleAddress);
      const assessorContracts = marketConfigs.AaveCasinoConfig.AssessorContracts[network][symbol];
      const AssetCurrencies = marketConfigs.AaveCasinoConfig.AssetCurrencies[network][symbol];
      await waitForTx(
        await CasinoOracle.setAssetConfig(
          [reserveAssetAddress],
          [assessorContracts],
          [AssetCurrencies]
        )
      );
    } else {
      throw new Error(
        `
          ORACLE INTEGRATION NOT FINALIZED
          `
      );
    }

    // For BUSD
    // lconf([["0xE36eb4B85E58F9B99Ae8a5A3ba66aDad2360509b", "0xf715B4CB3B5bF5Ac2b7F4EeD90Ba9b648F8C6077", "0x4562e79B3D8Ed01b253028Eb57C51889C487b082", 18, "0x7af4AC5f51658e0f4C52AB155a46C8735D93c6a6", "0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b", "0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00", "0x0000000000000000000000000000000000000000", "BUSD", "Aave Casino market BUSD", "aBUSD", "Aave Casino variable debt BUSD", "variableDebtBUSD", "Aave Casino stable debt BUSD", "stableDebtBUSD", '0x10']])
    //["0xE36eb4B85E58F9B99Ae8a5A3ba66aDad2360509b", "0xf715B4CB3B5bF5Ac2b7F4EeD90Ba9b648F8C6077", "0x4562e79B3D8Ed01b253028Eb57C51889C487b082", 18, "0x7af4AC5f51658e0f4C52AB155a46C8735D93c6a6", "0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b", "0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00", "0x0000000000000000000000000000000000000000", "BUSD", "Aave Casino market BUSD", "aBUSD", "Aave Casino variable debt BUSD", "variableDebtBUSD", "Aave Casino stable debt BUSD", "stableDebtBUSD", '0x10']
  });
