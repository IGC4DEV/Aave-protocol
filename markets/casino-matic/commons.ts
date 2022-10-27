import BigNumber from 'bignumber.js';
import {
  oneUsd,
  oneRay,
  RAY,
  ZERO_ADDRESS,
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
} from '../../helpers/constants';
import { ICommonConfiguration, ePolygonNetwork } from '../../helpers/types';

// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'AaveCasinoMatic',
  ATokenNamePrefix: 'Aave Matic Casino Market',
  StableDebtTokenNamePrefix: 'Aave Matic Casino Market stable debt',
  VariableDebtTokenNamePrefix: 'Aave Matic Casino Market variable debt',
  SymbolPrefix: 'm',
  ProviderId: 0, // Overriden in index.ts
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: oneUsd.toString(),
  ProtocolGlobalParams: {
    TokenDistributorPercentageBase: '10000',
    MockUsdPriceInWei: '5848466240000000',
    UsdAddress: '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96',
    NilAddress: '0x0000000000000000000000000000000000000000',
    OneAddress: '0x0000000000000000000000000000000000000001',
    AaveReferral: '0',
  },

  // ----------------
  // COMMON PROTOCOL PARAMS ACROSS POOLS AND NETWORKS
  // ----------------

  Mocks: {
    AllAssetsInitialPrices: {
      ...MOCK_CHAINLINK_AGGREGATORS_PRICES,
    },
  },
  // TODO: reorg alphabetically, checking the reason of tests failing
  LendingRateOracleRatesCommon: {
    'IMMO': {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
    DAI: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
  },
  // ----------------
  // COMMON PROTOCOL ADDRESSES ACROSS POOLS
  // ----------------

  // If PoolAdmin/emergencyAdmin is set, will take priority over PoolAdminIndex/emergencyAdminIndex
  PoolAdmin: {
    [ePolygonNetwork.mumbai]: undefined,
    [ePolygonNetwork.matic]: undefined,
  },
  PoolAdminIndex: 0,
  EmergencyAdmin: {
    [ePolygonNetwork.mumbai]: undefined,
    [ePolygonNetwork.matic]: undefined,
  },
  EmergencyAdminIndex: 0,
  ProviderRegistry: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  ProviderRegistryOwner: {
    [ePolygonNetwork.mumbai]: '0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810',
    [ePolygonNetwork.matic]: '',
  },
  LendingRateOracle: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  LendingPoolCollateralManager: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  LendingPoolConfigurator: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  LendingPool: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  WethGateway: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  TokenDistributor: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },

  AaveOracle: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  FallbackOracle: {
    [ePolygonNetwork.mumbai]: "0x9Ba6164c48Ae47c4838037ee8664786CBae54772",
    [ePolygonNetwork.matic]: ZERO_ADDRESS,
  },
  ChainlinkAggregator: {
    [ePolygonNetwork.matic]: {
        'IMMO': ZERO_ADDRESS,
        DAI: '',
    },
    [ePolygonNetwork.mumbai]: {
        'IMMO': ZERO_ADDRESS,
        DAI: '0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046',
    },
  },
  ReserveAssets: {
    [ePolygonNetwork.matic]: {},
    [ePolygonNetwork.mumbai]: {},
  },
  ReservesConfig: {},
  ATokenDomainSeparator: {
    [ePolygonNetwork.mumbai]: '',
    [ePolygonNetwork.matic]: '',
  },
  WETH: {
    [ePolygonNetwork.mumbai]: "0x3C68CE8504087f89c640D02d133646d98e64ddd9",
    [ePolygonNetwork.matic]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  ReserveFactorTreasuryAddress: {
    [ePolygonNetwork.mumbai]: "0x1BD5503E542733E19A0B6b3b7C92Df60C3398F0E",
    [ePolygonNetwork.matic]: '0x7734280A4337F37Fbf4651073Db7c28C80B339e9',
  },
  WrappedNativeToken: {
    [ePolygonNetwork.mumbai]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    [ePolygonNetwork.matic]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  IncentivesController: {
    [ePolygonNetwork.mumbai]: ZERO_ADDRESS,
    [ePolygonNetwork.matic]: ZERO_ADDRESS,
  },
};