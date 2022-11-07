import { task } from 'hardhat/config';
import {
  getLendingPoolAddressesProvider,
  getLendingPoolConfiguratorProxy} from './../../helpers/contracts-getters';
import { BytesLike } from '@ethersproject/bytes';
import { setDRE } from '../../helpers/misc-utils';

const LENDING_POOL_ADDRESS_PROVIDER = {
  main: '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
  kovan: '0x652B2937Efd0B5beA1c8d54293FC1289672AFC6b',
  goerli: '0xBBBcd3ba3c59137978ff5525C0441b7F1Cb7ca5d',
};

task('external:init_params', 'Deploy A token, Debt Tokens, Risk Parameters')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify, symbol }, localBRE) => {
    const network = 'goerli';

    await setDRE(localBRE);

    const addressProvider = await getLendingPoolAddressesProvider(
      LENDING_POOL_ADDRESS_PROVIDER[network]
    );

    let UpdateATokenInput : {
        asset: string;
        treasury : string;
        incentivesController : string;
        name : string;
        symbol: string;
        implementation: string;
        params: string;
      }


    UpdateATokenInput = {
            asset : '0xe77806aE51F209c3b6490F573BB57877344BbBc9', 
            treasury : '0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00',
            incentivesController : '0x0000000000000000000000000000000000000000',
            name : 'Aave Casino market IMMO',
            symbol : 'aIMMO',
            implementation : '0x56131caD19337568211d138B3F34cA5f02a766AE',
            params : '0x10',
    }

    let UpdateDebtTokenInput :{
        asset: string;
        incentivesController : string;
        name : string;
        symbol: string;
        implementation: string;
        params: string;
    }

    UpdateDebtTokenInput = {
        asset : "0xe77806aE51F209c3b6490F573BB57877344BbBc9",
        incentivesController : "0x0000000000000000000000000000000000000000", 
        name : "Aave Casino variable debt IMMO", 
        symbol : "variableDebtIMMO", 
        implementation : "0x91812676be4F4dc595bf0e94227e1A6Abc1DBCF8", 
        params : '0x10',
    }
  

    const configuratorAddress = await addressProvider.getLendingPoolConfigurator();
    const configurator = await getLendingPoolConfiguratorProxy(configuratorAddress);
    console.log('A')
    const tx3 = await configurator.updateAToken(UpdateATokenInput)
    console.log('A')
    //const tx4 = await configurator.updateStableDebtToken(UpdateATokenInput)
    const tx5 = await configurator.updateVariableDebtToken(UpdateATokenInput)
    const tx6 = await configurator.setReserveInterestRateStrategyAddress("0xe77806aE51F209c3b6490F573BB57877344BbBc9", "0xC70170Af5A213A6525132655519F9C843c95503B")
});
