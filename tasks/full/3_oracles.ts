import { task } from 'hardhat/config';
import { getParamPerNetwork } from '../../helpers/contracts-helpers';
import { deployAaveOracle, deployCasinoMarketOracle, deployLendingRateOracle } from '../../helpers/contracts-deployments';
import { setInitialMarketRatesInRatesOracleByHelper } from '../../helpers/oracles-helpers';
import { ICommonConfiguration, eNetwork, SymbolMap, IAaveCasinoConfiguration } from '../../helpers/types';
import { waitForTx, notFalsyOrZeroAddress } from '../../helpers/misc-utils';
import {
  ConfigNames,
  loadPoolConfig,
  getGenesisPoolAdmin,
  getLendingRateOracles,
  getQuoteCurrency,
} from '../../helpers/configuration';
import {
  getAaveOracle,
  getLendingPoolAddressesProvider,
  getLendingRateOracle,
  getPairsTokenAggregator,
} from '../../helpers/contracts-getters';
import { AaveOracle, LendingRateOracle } from '../../types';

task('full:deploy-oracles', 'Deploy oracles for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ verify, pool }, DRE) => {
    try {
      await DRE.run('set-DRE');
      const network = <eNetwork>DRE.network.name;
      const poolConfig = loadPoolConfig(pool);
      const {
        ProtocolGlobalParams: { UsdAddress },
        ReserveAssets,
        FallbackOracle,
        ChainlinkAggregator,
      } = poolConfig as ICommonConfiguration;
      const lendingRateOracles = getLendingRateOracles(poolConfig);
      const addressesProvider = await getLendingPoolAddressesProvider();
      const admin = await getGenesisPoolAdmin(poolConfig);
      const aaveOracleAddress = getParamPerNetwork(poolConfig.AaveOracle, network);
      const lendingRateOracleAddress = getParamPerNetwork(poolConfig.LendingRateOracle, network);
      const reserveAssets = await getParamPerNetwork(ReserveAssets, network);
      const chainlinkAggregators = await getParamPerNetwork(ChainlinkAggregator, network);
      const tokensToWatch: SymbolMap<string> = {
        ...reserveAssets,
        //USD: UsdAddress,
      };
      console.log(tokensToWatch)
      const [tokens, aggregators] = getPairsTokenAggregator(
        tokensToWatch,
        chainlinkAggregators,
        poolConfig.OracleQuoteCurrency
      );
      let fallbackOracleAddress = await getParamPerNetwork(FallbackOracle, network);
      let CasinoOracle;
      if (pool === ConfigNames.Casino || pool === ConfigNames.CasinoMatic ) {
        CasinoOracle = await deployCasinoMarketOracle(verify);
        fallbackOracleAddress = CasinoOracle.address;

        const CasinoConfig = poolConfig as IAaveCasinoConfiguration;
        const assessorContracts = await getParamPerNetwork(CasinoConfig.AssessorContracts, network);
        const assetCurrencies = await getParamPerNetwork(CasinoConfig.AssetCurrencies, network);
        const dropTokens = Object.keys(assessorContracts);
        await waitForTx(
          await CasinoOracle.setAssetConfig(
            dropTokens.map((token) => tokensToWatch[token]),
            dropTokens.map((token) => assessorContracts[token]),
            dropTokens.map((token) => assetCurrencies[token])
          )
        );
      }

      let aaveOracle: AaveOracle;
      let lendingRateOracle: LendingRateOracle;

      if (notFalsyOrZeroAddress(aaveOracleAddress)) {
        aaveOracle = await getAaveOracle(aaveOracleAddress);
        await waitForTx(await aaveOracle.setAssetSources(tokens, aggregators));
      } else {
        aaveOracle = await deployAaveOracle(
          [
            tokens,
            aggregators,
            fallbackOracleAddress,
            await getQuoteCurrency(poolConfig),
            poolConfig.OracleQuoteUnit,
          ],
          verify
        );
        await waitForTx(await aaveOracle.setAssetSources(tokens, aggregators));
      }
      if (pool === ConfigNames.Casino || pool === ConfigNames.Casino ) {
        await waitForTx(await CasinoOracle.setAaveOracle(aaveOracle.address));
      }
      if (notFalsyOrZeroAddress(lendingRateOracleAddress)) {
        lendingRateOracle = await getLendingRateOracle(lendingRateOracleAddress);
      } else {
        lendingRateOracle = await deployLendingRateOracle(verify);
        const { USD, ...tokensAddressesWithoutUsd } = tokensToWatch;
        await setInitialMarketRatesInRatesOracleByHelper(
          lendingRateOracles,
          tokensAddressesWithoutUsd,
          lendingRateOracle,
          admin
        );
      }

      console.log('Aave Oracle: %s', aaveOracle.address);
      console.log('Lending Rate Oracle: %s', lendingRateOracle.address);

      // Register the proxy price provider on the addressesProvider
      await waitForTx(await addressesProvider.setPriceOracle(aaveOracle.address));
      await waitForTx(await addressesProvider.setLendingRateOracle(lendingRateOracle.address));
    } catch (error) {
      if (DRE.network.name.includes('tenderly')) {
        const transactionLink = `https://dashboard.tenderly.co/${DRE.config.tenderly.username}/${
          DRE.config.tenderly.project
        }/fork/${DRE.tenderly.network().getFork()}/simulation/${DRE.tenderly.network().getHead()}`;
        console.error('Check tx error:', transactionLink);
      }
      throw error;
    }
  });
