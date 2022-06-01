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



## Casino contracts deployed on Kovan
LendingPoolAddressesProvider: 0x26d9988a447F66d39FcB1361EF78A9320fD5150c
PermissionManager: 0x900d2dbaa3A43b5B109FdAFE27d35b995817bE60
ReserveLogic: 0x17e66da6651FFe976E085EA11dB06dfA5d863223
GenericLogic: 0xE9De2c664797B85414f2FEe2a79DB32c396C6232
ValidationLogic: 0x23fe734241310e9D152A2e3F4EecB41c661dF6B8
LendingPoolImpl: 0x56131caD19337568211d138B3F34cA5f02a766AE
LendingPool: 0xFB7a57B9344374726223860E97C804E57AD1FF73
LendingPoolConfiguratorImpl: 0x91812676be4F4dc595bf0e94227e1A6Abc1DBCF8
LendingPoolConfigurator: 0x6d2423B25944b5Bae2123Bb5a08978aE2D700615
StableAndVariableTokensHelper: 0xEcf3A32BF9aA336beb5227dA21c421e812e8BCAc
ATokensAndRatesHelper: 0x9E204F141aBB8a4621fD05b95618485e7A88a649
AToken: 0xDD1C0f96D8111bc136c8f03950341573186fC524
StableDebtToken: 0xA17E5954255F1EdAe7264D4c3FC55FaC3284F842
VariableDebtToken: 0x9a0F9684A9F871FC8a7466562B0bFB813527DBf5
AaveOracle: 0x431ab33e5983274eA06aaAEad9732C29d6F65C0E
LendingRateOracle: 0xb761e6EFBC6C12A4F797b4Ff38FcBa5eA67ac9B2
AaveProtocolDataProvider: 0xDd2230a74dA8Ec76a14536b095E5946834E35DE7
PermissionedWETHGateway: 0xeE4B8aB98781E1B7836FF03Db18A0a84D43DF2F8
PermissionedStableDebtToken: 0x064DeEc0c4cBD82Ca0232326C7944db8FBBa9Adf
PermissionedVariableDebtToken: 0x0E5F23027e66e78EC13BB9F37c9630ece657AA45
aTokenImpl: 0xDD1C0f96D8111bc136c8f03950341573186fC524
DefaultReserveInterestRateStrategy: 0xeABce1Fb2F548bc366F8D548BD1Fe0545903A338
rateStrategyStable: 0x69D4ED74DaC011371fc72E5f36A18ABfe3581191
WalletBalanceProvider: 0xE6076441497A65ffacf50d2Fd8B2f05e283d965D
UiPoolDataProvider: 0xA357F57eA50EcdA910619cC0cF3A14B9263F7ef9
rateStrategyCAST: 0xeABce1Fb2F548bc366F8D548BD1Fe0545903A338
LendingPoolCollateralManagerImpl: 0xEAaf28D20a0B0F81a2F7bA8D7A6BE2fA120e01B2
LendingPoolCollateralManager: 0xEAaf28D20a0B0F81a2F7bA8D7A6BE2fA120e01B2

