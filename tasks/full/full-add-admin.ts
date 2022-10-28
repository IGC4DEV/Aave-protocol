import { task } from 'hardhat/config';
import {
  loadPoolConfig,
  ConfigNames,
  getWethAddress,
  getTreasuryAddress,
} from '../../helpers/configuration';
import * as contractGetters from '../../helpers/contracts-getters';
import { waitForTx } from '../../helpers/misc-utils';
import {
  getFirstSigner,
  getPermissionManager,
  getLendingPoolAddressesProvider,
  getLendingPool,
  getLendingPoolConfiguratorProxy,
} from '../../helpers/contracts-getters';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { deployWETHMocked } from '../../helpers/contracts-deployments';

task(`full-add-admin`, `Whitelists an admin into the CAsino market`)
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ pool }, localBRE) => {
    await localBRE.run('set-DRE');
    const poolConfig = loadPoolConfig(pool);

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const NEW_PERMISSION_ADMIN = '0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810';
    const NEW_PERMISSION_ADMIN2 = '0x8DBe4B09d226e047907fdBBa9320936C133D8F18';
    const NEW_USER = '0x8DBe4B09d226e047907fdBBa9320936C133D8F18'


    const deployer = await getFirstSigner();
    const deployerAddress = await deployer.getAddress();
    console.log(`Signer: ${deployerAddress}`);

    //adding permissions to the permission manager for the weth gateway
    const permissionManager = await contractGetters.getPermissionManager();
    console.log('PermissionManager: ', permissionManager.address);

    await waitForTx(
      await permissionManager.connect(deployer).addPermissionAdmins([NEW_PERMISSION_ADMIN])
    );
    await waitForTx(
      await permissionManager.connect(deployer).addPermissionAdmins([NEW_PERMISSION_ADMIN2])
    );

    // borrow flag is 1, depositor 0
    await permissionManager
      .connect(deployer)
      .addPermissions([0, 1, 2, 3], [NEW_PERMISSION_ADMIN, NEW_PERMISSION_ADMIN, NEW_PERMISSION_ADMIN, NEW_PERMISSION_ADMIN]);

    // borrow flag is 1, depositor 0
    await permissionManager
      .connect(deployer)
      .addPermissions([0, 1, 2, 3], [NEW_PERMISSION_ADMIN2, NEW_PERMISSION_ADMIN2, NEW_PERMISSION_ADMIN2, NEW_PERMISSION_ADMIN2]);

    // Add user
    await permissionManager
      .connect(deployer)
      .addPermissions([0, 1], [NEW_USER, NEW_USER]);
    console.log(`\tFinished adding ${NEW_USER} as borrower and depositor`);
  });

/*
task(`unpause-pool`, `Unpause-pool`).setAction(async ({}, localBRE) => {
  await localBRE.run('set-DRE');
  const deployer = await getFirstSigner();
  const users = await getEthersSigners();
  const nonAdmin = users[2];

  const emergencyAdmin = users[1];

  console.log('You need to use the Emergency Admin Address to unpause');
  const POOL_ADDRESSES_PROVIDER = '0x76661FC0AC3fD4AB29107414F9BEbb2B92D6Ca6e';
  const provider = await getLendingPoolAddressesProvider(POOL_ADDRESSES_PROVIDER);
  console.log(
    'Emergency Admin address:',
    await provider.connect(emergencyAdmin).getEmergencyAdmin()
  );
  console.log('Signer: ', await deployer.getAddress());
  const pool = await getLendingPool(await provider.connect(emergencyAdmin).getLendingPool());
  console.log(`\tPool paused? `, await pool.paused());

  const configurator = await getLendingPoolConfiguratorProxy(
    await provider.connect(emergencyAdmin).getLendingPoolConfigurator()
  );

  console.log('foo');

  await configurator.connect(emergencyAdmin).setPoolPause(false);

  console.log(`\tPool pause? `, await pool.paused());
});

task(`deploy-weth-mocks`, `Deploys the Weth9 mocks for arc goerli`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-DRE');
    const deployer = await getFirstSigner();

    const wethMock = await deployWETHMocked(true);
    console.log('deployed wethmock', wethMock);
  }
);*/
