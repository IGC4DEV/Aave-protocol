import { isAddress } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { IAaveCasinoConfiguration, eEthereumNetwork, eContractid } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyCAST,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const KDAI = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';
const RDAI = '0x4aAded56bd7c69861E8654719195fCA9C670EB45';



export const AaveCasinoConfig: IAaveCasinoConfiguration = {
  ...CommonsConfig,
  MarketId: 'Aave Casino market',
  ProviderId: 1,
  LendingPoolImpl: eContractid.PermissionedLendingPool,
  ReservesConfig: {
    DAI: strategyDAI,
    'CAST': strategyCAST,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'CAST': '0x00e048b690a53ED209D3d591395FAbAEdeDc3d12',
      DAI: KDAI,
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.rinkeby]: {
      'CAST': '0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea',
      DAI: RDAI,
      EUR:'0x0000000000000000000000000000000000000001',
  },
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
  },
  AssessorContracts: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'CAST': "0x7812e263C6852707bA8c750eeA07556d046378d5",
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.rinkeby]: {
      'CAST': "0xe20AB3CA44fa9e407d1Cb5BaD58c35F6A81C5f4E",
    },
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
  },
  AssetCurrencies: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'CAST': KDAI,
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.rinkeby]: {
      'CAST': '0x0000000000000000000000000000000000000001',
    },
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
  },
};

export default AaveCasinoConfig;
