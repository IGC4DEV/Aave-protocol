import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { usingTenderly } from '../../helpers/tenderly-utils';
import * as contractGetters from '../../helpers/contracts-getters';




task("whitelist", "Whitelist users")
.setAction(async (undefined, DRE) => {
    await DRE.run("set-DRE");
    const permissionManager = await contractGetters.getPermissionManager();
    await permissionManager.addPermissions([0,1,2,3], ["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810", "0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810", "0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810", "0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"])
    await permissionManager.addPermissions([0,1,2], ["0x8DBe4B09d226e047907fdBBa9320936C133D8F18", "0x8DBe4B09d226e047907fdBBa9320936C133D8F18", "0x8DBe4B09d226e047907fdBBa9320936C133D8F18"])
    await permissionManager.addPermissionAdmins(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"])
});