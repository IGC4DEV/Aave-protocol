import { task } from 'hardhat/config';
import * as contractGetters from '../../helpers/contracts-getters';
import { setDRE } from '../../helpers/misc-utils';
import { waitForTx } from '../../helpers/misc-utils';

task("whitelist", "Whitelist users")
.setAction(async (undefined, localBRE) => {
    await setDRE(localBRE);

    const permissionManager = await contractGetters.getPermissionManager("0xb5d302888759648734CADBCa7cC39Ef2B3DFFb0e");

    //await permissionManager.connect(signer).addPermissions([0,1,2,3], ["0x9a3813D7143179bB8Cf10ED745A79C6556621ffF", "0x9a3813D7143179bB8Cf10ED745A79C6556621ffF", "0x9a3813D7143179bB8Cf10ED745A79C6556621ffF", "0x9a3813D7143179bB8Cf10ED745A79C6556621ffF"])
    //CASINO
    //await permissionManager.connect(signer).addPermissions([0,1], ["0x9a3813D7143179bB8Cf10ED745A79C6556621ffF", "0x9a3813D7143179bB8Cf10ED745A79C6556621ffF"])
    //await permissionManager.connect(signer).addPermissions([2], ["0x2FC204F23998a8fdA04a315fd51062CC1942D5BA"])
    await waitForTx(await permissionManager.addPermissions([0], ["0x9FEC005De9011ea4aDfE789B390637E3bB2f78c1"]))

    //await permissionManager.connect(signer).addPermissions([0,1], ["0xb55Ea20E5C98D97E5ee329A2F81fa25F4c1Df864", "0xb55Ea20E5C98D97E5ee329A2F81fa25F4c1Df864"])

    //await permissionManager.addPermissionAdmins(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"])
});