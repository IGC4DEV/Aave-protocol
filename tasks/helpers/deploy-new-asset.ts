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
    console.log('C')
    const poolAddress = await addressProvider.getLendingPool();

    const aToken = await deployCustomAToken(verify);

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

    console.log('H')
    // console.log(`
    // New interest bearing asset deployed on ${network}:
    // Interest bearing a${symbol} address: ${aToken.address}
    // Variable Debt variableDebt${symbol} address: ${variableDebt.address}
    // Stable Debt stableDebt${symbol} address: ${stableDebt.address}
    // Strategy Implementation for ${symbol} address: ${rates.address}
    // `);

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
    const decimals = reserveConfigs['strategy' + symbol].reserveDecimals;
    console.log(decimals)

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
  

    const configuratorAddress = await addressProvider.getLendingPoolConfigurator();
    const configurator = await getLendingPoolConfiguratorProxy(configuratorAddress);
    console.log("testststststst");

    if(strategyParams.borrowingEnabled == true) {
      if(strategyParams.stableBorrowRateEnabled)
        await configurator.enableBorrowingOnReserve(reserveAssetAddress, true);
      else{
        await configurator.enableBorrowingOnReserve(reserveAssetAddress, false);
      }
    }


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
  });
