import { IAaveCasinoAvaxConfiguration, eAvalancheNetwork, eContractid } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyIMMO,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const AaveCasinoAvaxConfig: IAaveCasinoAvaxConfiguration = {
  ...CommonsConfig,
  MarketId: 'Casino Avax Market',
  ProviderId: 4,
  LendingPoolImpl: eContractid.CasinoPermissionedLendingPool,
  ReservesConfig: {
    DAI: strategyDAI,
    IMMO: strategyIMMO,
  },
  ReserveAssets: {
    [eAvalancheNetwork.avalanche]: {
      'IMMO': '',
      DAI: '',
    },
    [eAvalancheNetwork.fuji]: {
      'IMMO': '',
      DAI: '',
    },
  },
  AssessorContracts: {
    [eAvalancheNetwork.avalanche]: {
      'IMMO': '',
    },
    [eAvalancheNetwork.fuji]: {
      'IMMO': '',
    },
  },
  AssetCurrencies: {
    [eAvalancheNetwork.avalanche]: {
      'IMMO': '',
    },
    [eAvalancheNetwork.fuji]: {
      'IMMO': '',
    },
  },
};

export default AaveCasinoAvaxConfig;