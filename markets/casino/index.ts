import { isAddress } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { IAaveCasinoConfiguration, eEthereumNetwork, eContractid } from '../../helpers/types';
import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyIMMO,
  strategyBUSD,
  strategyUSDT,
  strategyEURL,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const KDAI = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';
const RDAI = '0x4aAded56bd7c69861E8654719195fCA9C670EB45';
const GDAI = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';
const GBUSD = '0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b';
const GUSDT = '0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7'



export const AaveCasinoConfig: IAaveCasinoConfiguration = {
  ...CommonsConfig,
  MarketId: 'Aave Casino market',
  ProviderId: 1,
  LendingPoolImpl: eContractid.CasinoPermissionedLendingPool,
  ReservesConfig: {
    DAI: strategyDAI,
    'IMMO': strategyIMMO,
    BUSD: strategyBUSD,
    USDT: strategyUSDT,
    EURL: strategyEURL,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'IMMO': '0x00e048b690a53ED209D3d591395FAbAEdeDc3d12',
      DAI: KDAI,
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
    [eEthereumNetwork.goerli]: {
      'IMMO': "0xEcf3A32BF9aA336beb5227dA21c421e812e8BCAc", // old IMMO : '0xe77806aE51F209c3b6490F573BB57877344BbBc9', // Old Casino Token '0xaD55Dc6cAE4219F48Cc6c3282E3d3b1A7DB53c42',
      DAI: GDAI,
      BUSD: GBUSD,
      USDT: GUSDT,
      EURL: "0xb5da4907FFC9F286A0923FE81904aAB7cde4c09C"
    },
  },
  AssessorContracts: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'IMMO': "0x7812e263C6852707bA8c750eeA07556d046378d5",
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
    [eEthereumNetwork.goerli]: {
      'IMMO': "0x883DF09dac21Db4B1B682BDC75FBd167ECDcB8f9",
    },
  },
  AssetCurrencies: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.kovan]: {
      'IMMO': KDAI,
    },
    [eEthereumNetwork.ropsten]: {},
    [eEthereumNetwork.main]: {},
    [eEthereumNetwork.tenderly]: {},
    [eEthereumNetwork.goerli]: {
      'IMMO': GDAI,
    },
  },
};

export default AaveCasinoConfig;
