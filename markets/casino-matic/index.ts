import { IAaveCasinoMaticConfiguration, ePolygonNetwork, eContractid } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyIMMO,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const AaveCasinoMaticConfig: IAaveCasinoMaticConfiguration = {
  ...CommonsConfig,
  MarketId: 'Casino Matic Market',
  ProviderId: 1,
  LendingPoolImpl: eContractid.CasinoPermissionedLendingPool,
  ReservesConfig: {
    DAI: strategyDAI,
    IMMO: strategyIMMO,
  },
  ReserveAssets: {
    [ePolygonNetwork.matic]: {
      'IMMO': '',
      DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    [ePolygonNetwork.mumbai]: {
      // Mock tokens with a simple "mint" external function, except wmatic
      'IMMO': '0x663c6e8Bd60B3f6A9C5bFee2eb4c9f4C63dDCEF3',
      DAI: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    },
  },
  AssessorContracts: {
    [ePolygonNetwork.matic]: {
      'IMMO': '',
    },
    [ePolygonNetwork.mumbai]: {
      'IMMO': '0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea',
    },
  },
  AssetCurrencies: {
    [ePolygonNetwork.matic]: {
      'IMMO': '',
    },
    [ePolygonNetwork.mumbai]: {
      'IMMO': '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    },
  },
};

export default AaveCasinoMaticConfig;