[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Build pass](https://github.com/AAVE/protocol-v2/actions/workflows/node.js.yml/badge.svg)](https://github.com/aave/protocol-v2/actions/workflows/node.js.yml)
```
        .///.                .///.     //.            .//  `/////////////-
       `++:++`              .++:++`    :++`          `++:  `++:......---.`
      `/+: -+/`            `++- :+/`    /+/         `/+/   `++.
      /+/   :+/            /+:   /+/    `/+/        /+/`   `++.
  -::/++::`  /+:       -::/++::` `/+:    `++:      :++`    `++/:::::::::.
  -:+++::-`  `/+:      --++/---`  `++-    .++-    -++.     `++/:::::::::.
   -++.       .++-      -++`       .++.    .++.  .++-      `++.
  .++-         -++.    .++.         -++.    -++``++-       `++.
 `++:           :++`  .++-           :++`    :+//+:        `++:----------`
 -/:             :/-  -/:             :/.     ://:         `/////////////-
```

# Aave Protocol v2

This repository contains the smart contracts source code and markets configuration for Aave Protocol V2. The repository uses Docker Compose and Hardhat as development enviroment for compilation, testing and deployment tasks.

## What is Aave?

Aave is a decentralized non-custodial liquidity markets protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.

## Documentation

The documentation of Aave V2 is in the following [Aave V2 documentation](https://docs.aave.com/developers/v/2.0/) link. At the documentation you can learn more about the protocol, see the contract interfaces, integration guides and audits.

For getting the latest contracts addresses, please check the [Deployed contracts](https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts) page at the documentation to stay up to date.

A more detailed and technical description of the protocol can be found in this repository, [here](./aave-v2-whitepaper.pdf)

## Audits

- MixBytes (16/09/2020 - 03/12/2020): [report](./audits/Mixbytes-aave-v2-03-12-2020.pdf)
- PeckShield (29/09/2020 - 03/12/2020) : [report](./audits/Peckshield-aave-v2-03-12-2020-EN.pdf) (Also available in Chinese in the same folder)
- CertiK (28/09/2020 - 02/12/2020): [report](./audits/Certik-aave-v2-03-12-2020.pdf)
- Consensys Diligence (09/09/2020 - 09/10/2020): [report](https://consensys.net/diligence/audits/2020/09/aave-protocol-v2/)
- Certora, formal verification (02/08/2020 - 29/10/2020): [report](./audits/Certora-FV-aave-v2-03-12-2020.pdf)
- SigmaPrime (January 2021): [report](./audits/SigmaPrime-aave-v2-01-2021.pdf)

## Connect with the community

You can join at the [Discord](http://aave.com/discord) channel or at the [Governance Forum](https://governance.aave.com/) for asking questions about the protocol or talk about Aave with other peers.

## Getting Started

You can install `@aave/protocol-v2` as an NPM package in your Hardhat, Buidler or Truffle project to import the contracts and interfaces:

`npm install @aave/protocol-v2`

Import at Solidity files:

```
import {ILendingPool} from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";

contract Misc {

  function deposit(address pool, address token, address user, uint256 amount) public {
    ILendingPool(pool).deposit(token, amount, user, 0);
    {...}
  }
}
```

The JSON artifacts with the ABI and Bytecode are also included into the bundled NPM package at `artifacts/` directory.

Import JSON file via Node JS `require`:

```
const LendingPoolV2Artifact = require('@aave/protocol-v2/artifacts/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json');

// Log the ABI into console
console.log(LendingPoolV2Artifact.abi)
```

## Setup

The repository uses Docker Compose to manage sensitive keys and load the configuration. Prior any action like test or deploy, you must run `docker-compose up` to start the `contracts-env` container, and then connect to the container console via `docker-compose exec contracts-env bash`.

Follow the next steps to setup the repository:

- Install `docker` and `docker-compose`
- Create an enviroment file named `.env` and fill the next enviroment variables

```
# Mnemonic, only first address will be used
MNEMONIC=""

# Add Alchemy or Infura provider keys, alchemy takes preference at the config level
ALCHEMY_KEY=""
INFURA_KEY=""


# Optional Etherscan key, for automatize the verification of the contracts at Etherscan
ETHERSCAN_KEY=""

# Optional, if you plan to use Tenderly scripts
TENDERLY_PROJECT=""
TENDERLY_USERNAME=""

```

## Markets configuration

The configurations related with the Aave Markets are located at `markets` directory. You can follow the `IAaveConfiguration` interface to create new Markets configuration or extend the current Aave configuration.

Each market should have his own Market configuration file, and their own set of deployment tasks, using the Aave market config and tasks as a reference.

## Test

You can run the full test suite with the following commands:

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run test
```

## Deployments

For deploying Aave Protocol V2, you can use the available scripts located at `package.json`. For a complete list, run `npm run` to see all the tasks.

### Kovan deployment

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run aave:kovan:full:migration
```

### Kovan Aave ARC Deployment

You can deploy aave-arc with default configuration on kovan.

In `markets/aave-arc/commons.ts` make following changes:

- Configure `ProviderRegistryOwner` and `ReserveFactorTreasuryAddress`

  Set owner to your deployer address with kovan funds. 

  Set `ReserveFactorTreasuryAddress` to your team's wallet

  **Notet:** Script uses first address generated, from `MNEMONIC` provided in `.env` file, as the deployer.

  ```
  ProviderRegistryOwner: {
    [eEthereumNetwork.kovan]: '0xYourDeployerAddress',
    // Other network settings. You can leave them empty or same
  },

  ReserveFactorTreasuryAddress: {
    [eEthereumNetwork.kovan]: '0xYourDeployerAddress,
    // Other network settings. You can leave them empty or same
  },
  ```

- Configure to deploy new `ProviderRegistry` and `LendingPoolCollateralManager`

  Set registry and collateral manager address to empty string to deploy new registry.

  ```
  ProviderRegistry: {
    [eEthereumNetwork.kovan]: '',
    // Other network settings. You can leave them empty or same
  },
  LendingPoolCollateralManager: {
    [eEthereumNetwork.kovan]: '',
  }
  ```

- Configure to deploy/initialize `PermissionedWethGateWay`

  Set gateway address to empty string to deploy new.

  ```
  WethGateway: {
    [eEthereumNetwork.kovan]: '',
    // Other network settings. You can leave them empty or same
  },
  ```

**Note:** To configure aave arc market you can update `markets/aave-arc/`

#### Deploy Market

**Using Docker**

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run arc:kovan:full:migration
```

**Without Docker**

```
npm run arc:kovan:full:migration
```

### Mainnet fork deployment

You can deploy Aave Protocol v2 in a forked Mainnet chain using Hardhat built-in fork feature:

```
docker-compose run contracts-env npm run aave:fork:main
```

### Deploy Aave into a Mainnet Fork via console

You can deploy Aave into the Hardhat console in fork mode, to interact with the protocol inside the fork or for testing purposes.

Run the console in Mainnet fork mode:

```
docker-compose run contracts-env npm run console:fork
```

At the Hardhat console, interact with the Aave protocol in Mainnet fork mode:

```
// Deploy the Aave protocol in fork mode
await run('aave:mainnet')

// Or your custom Hardhat task
await run('your-custom-task');

// After you initialize the HRE via 'set-DRE' task, you can import any TS/JS file
run('set-DRE');

// Import contract getters to retrieve an Ethers.js Contract instance
const contractGetters = require('./helpers/contracts-getters'); // Import a TS/JS file

// Lending pool instance
const lendingPool = await contractGetters.getLendingPool("LendingPool address from 'aave:mainnet' task");

// You can impersonate any Ethereum address
await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0xb1adceddb2941033a090dd166a462fe1c2029484"]});

const signer = await ethers.provider.getSigner("0xb1adceddb2941033a090dd166a462fe1c2029484")

// ERC20 token DAI Mainnet instance
const DAI = await contractGetters.getIErc20Detailed("0x6B175474E89094C44Da98b954EedeAC495271d0F");

// Approve 100 DAI to LendingPool address
await DAI.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100'));

// Deposit 100 DAI
await lendingPool.connect(signer).deposit(DAI.address, ethers.utils.parseUnits('100'), await signer.getAddress(), '0');

```

## Interact with Aave in Mainnet via console

You can interact with Aave at Mainnet network using the Hardhat console, in the scenario where the frontend is down or you want to interact directly. You can check the deployed addresses at https://docs.aave.com/developers/deployed-contracts.

Run the Hardhat console pointing to the Mainnet network:

```
docker-compose run contracts-env npx hardhat --network main console
```

At the Hardhat console, you can interact with the protocol:

```
// Load the HRE into helpers to access signers
run("set-DRE")

// Import getters to instance any Aave contract
const contractGetters = require('./helpers/contracts-getters');

// Load the first signer
const signer = await contractGetters.getFirstSigner();

// Lending pool instance
const lendingPool = await contractGetters.getLendingPool("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");

// ERC20 token DAI Mainnet instance
const DAI = await contractGetters.getIErc20Detailed("0x6B175474E89094C44Da98b954EedeAC495271d0F");

// Approve 100 DAI to LendingPool address
await DAI.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100'));

// Deposit 100 DAI
await lendingPool.connect(signer).deposit(DAI.address, ethers.utils.parseUnits('100'), await signer.getAddress(), '0');
```


Contract address on Goerli
```
LendingPoolAddressesProvider: 0xBBBcd3ba3c59137978ff5525C0441b7F1Cb7ca5d
PermissionManager: 0xb5d302888759648734CADBCa7cC39Ef2B3DFFb0e
ReserveLogic: 0xFd96379e53223b8514d9A7308e9BE44C74978f5c
GenericLogic: 0x56C693e05aB06B8714858C692f43aE06A8160cAA
ValidationLogic: 0xedadEDe174a1F3128c66D735470A5C8fF3A47dB8
LendingPoolImpl: 0x38430F288F322744DFB29C1a60d45A4d5F5b3eCE
LendingPool: 0x228d65503187621807517EaC8ed6FCF88aBb2998
LendingPoolConfiguratorImpl: 0xa6eF8e21e0034Ca7Cb7E0c3B100c86c0c08A2710
LendingPoolConfigurator: 0xb76C18D61D0760e628545A62FED8332c65747c14
StableAndVariableTokensHelper: 0x741cAD9Ed8Da3eab4b3f6ad427261e4241f84229
ATokensAndRatesHelper: 0xe8Cd36c2798293C9547F341C57471C6a0403B065
AToken: 0x593Bf00FA61B11dC262D6Cd0C86d26744bc3517a
StableDebtToken: 0x2A99A336cF449312e534AC3AEca11Be2B6C7b9a9
VariableDebtToken: 0xba9e72bf05F4061CCC154eCA33A62aD47bf62bDF
AaveOracle: 0x3D84cdFa0F62D683CAee44B73774100d33cB6452
LendingRateOracle: 0xfbBb711e349FF89C0B65DB76eDc37783BAd57Be8
AaveProtocolDataProvider: 0xB5748babF9Fc37F5D754CD17E4198c025Bb3e290
aTokenImpl: 0x593Bf00FA61B11dC262D6Cd0C86d26744bc3517a
DefaultReserveInterestRateStrategy: 0xB5f57080f93e252549666a9750E1cB4d6ECA81Be
WalletBalanceProvider: 0x0e7782469dA4B308b7D5770F14C07ee6c71536e9
PermissionedWETHGateway: 0xa9F9E6cdFF773aCfB785492bb0622b839212c027
PermissionedStableDebtToken: 0x229194C5D7be39387ECE48e227a89A33dA344135
PermissionedVariableDebtToken: 0x352e45EFf633Bfa350c228365310801480E9cE40
CasinoMarketOracle: 0x671Aaf6Da6D09Ef9107DAc7dfcB5a30027CFB965
rateStrategyStable: 0xC0cA2164a88D8896c57d486D7742c81EB368a48c
rateStrategyIMMO: 0xB5f57080f93e252549666a9750E1cB4d6ECA81Be
LendingPoolCollateralManagerImpl: 0x2D9939cCCf6bB4B9EF2487DDB6Ae291829b7a163
LendingPoolCollateralManager: 0x2D9939cCCf6bB4B9EF2487DDB6Ae291829b7a163


aBUSD: 0xE36eb4B85E58F9B99Ae8a5A3ba66aDad2360509b
Variable Debt variableDebtBUSD address: 0x4562e79B3D8Ed01b253028Eb57C51889C487b082
Stable Debt stableDebtBUSD address: 0xf715B4CB3B5bF5Ac2b7F4EeD90Ba9b648F8C6077
Strategy Implementation for BUSD address: 0x7af4AC5f51658e0f4C52AB155a46C8735D93c6a6
```

Contract Address on Mumbai deployed by 0x8DBe4B09d226e047907fdBBa9320936C133D8F18
LendingPoolAddressesProvider: 0x8040f18860c211B23aB10e68Ae29d99858222873
Pool Admin 0x8DBe4B09d226e047907fdBBa9320936C133D8F18
Emergency Admin 0x8DBe4B09d226e047907fdBBa9320936C133D8F18
ReserveLogic: 0x51C86505C80143675f57D218f2bFb44d89209DA6
GenericLogic: 0xb6AbA61899f8CBE748b08F3031cd606Ac793605D
ValidationLogic: 0xAE93e2ffe328d70dB3aaB54945b0A6F67FCB1e


LendingPoolAddressesProvider: 0x2D9939cCCf6bB4B9EF2487DDB6Ae291829b7a163
PermissionManager: 0x0e7782469dA4B308b7D5770F14C07ee6c71536e9
ReserveLogic: 0xeA802BA5AdEBd765CAeD9070dFd9adAb68483cE3
GenericLogic: 0x4085c42c4Fe15437812599B4F89fD6eB7665e95E
ValidationLogic: 0x06F0a01F84aB20DE70D2d29326eFBA9CfD5278BA
LendingPoolImpl: 0xAA685785DBB19Bb4e1cB725E15230e3CF1d9161B
LendingPool: 0xafdB5b478c216132441F034759c1e6a21C91Dc64
LendingPoolConfiguratorImpl: 0x2af692155eEE05C43F8D7438E85C221a81c1E3c1
LendingPoolConfigurator: 0xc8eD80bF1a5852216448f3BD1BeFBF646b654390
StableAndVariableTokensHelper: 0x2EA03F0BA77d89D9b79946F07574B90BD882Dd5d
ATokensAndRatesHelper: 0xE36eb4B85E58F9B99Ae8a5A3ba66aDad2360509b
AToken: 0x188fb233ADE4BBe325B7a2B85A84FbbcA3f1E57E
StableDebtToken: 0xAfb002D158512E04a5Ad3bcf7b09734c80375752
VariableDebtToken: 0x4562e79B3D8Ed01b253028Eb57C51889C487b082
AaveOracle: 0x24c0807348B58c7B5De5a949FA1a4478f2333cEa
LendingRateOracle: 0x7BD0af82B1BbeE336EeB8AE6EFefd9a832206C48
AaveProtocolDataProvider: 0x746e7f249e3649eB1f11f609d4ADDeABB6D0D0D6
aTokenImpl: 0x188fb233ADE4BBe325B7a2B85A84FbbcA3f1E57E
DefaultReserveInterestRateStrategy: 0x68a36A468d15B16E74E97472D6faCFFD7450254b
WalletBalanceProvider: 0x323b8899B2Cb25389eBb0f466468D1F377439f53
PermissionedWETHGateway: 0x5A7a7C95139F1993b83B9Da30A41415c772b6A0d
PermissionedStableDebtToken: 0x1F217113Eb6cBf6b9345ed453AD78B26C1ceff77
PermissionedVariableDebtToken: 0x0C1ABB0fD514969072c198ed2cBF385649dD9702
CasinoMarketOracle: 0x10390cd0a00a52477350F84f86e71D8FD4CEeD0e
rateStrategyStable: 0xad0776B01Ae937DB1B9F5bFdad73484194C7Dd02
LendingPoolCollateralManagerImpl: 0xAEcB2E8E7ea379307560f96299e524Bb64e800AF
LendingPoolCollateralManager: 0xAEcB2E8E7ea379307560f96299e524Bb64e800AF
rateStrategyIMMO: 0x68a36A468d15B16E74E97472D6faCFFD7450254b