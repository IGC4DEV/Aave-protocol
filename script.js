// docker-compose run contracts-env npm run console:fork

run("set-DRE")

const contractGetters = require('./helpers/contracts-getters');
const cdeploy = require('./helpers/contracts-deployments');


const contractHelpers = require('./helpers/contracts-helpers');

const conf = require('./artifacts/contracts/protocol/lendingpool/LendingPoolConfigurator.sol/LendingPoolConfigurator.json')
const oracle = require('./artifacts/contracts/misc/CasinoOracle.sol/CasinoMarketOracle.json')
const lpool = require('./artifacts/contracts/protocol/lendingpool/PermissionedLendingPool.sol/PermissionedLendingPool.json')
const lpoolCas = require('./artifacts/contracts/protocol/lendingpool/CasinoPermissionedLendingPool.sol/CasinoPermissionedLendingPool.json')
const colla = require('./artifacts/contracts/protocol/lendingpool/LendingPoolCollateralManager.sol/LendingPoolCollateralManager.json')
const permi = require('./artifacts/contracts/protocol/configuration/PermissionManager.sol/PermissionManager.json')

const signer = await ethers.provider.getSigner();

let lconf = new ethers.Contract("0xb76C18D61D0760e628545A62FED8332c65747c14", conf.abi, signer)
let pool = new ethers.Contract("0x228d65503187621807517EaC8ed6FCF88aBb2998", lpool.abi, signer)
let lcolla = new ethers.Contract("0x2D9939cCCf6bB4B9EF2487DDB6Ae291829b7a163", colla.abi, signer)
let poolcas = new ethers.Contract("0x228d65503187621807517EaC8ed6FCF88aBb2998", lpoolCas.abi, signer)

let permissionManager = new ethers.Contract("0xb5d302888759648734CADBCa7cC39Ef2B3DFFb0e", permi.abi, signer)


let f_oracle = new ethers.Contract("0x671Aaf6Da6D09Ef9107DAc7dfcB5a30027CFB965", oracle.abi, signer)
const lp = await contractGetters.getLendingPool("0x228d65503187621807517EaC8ed6FCF88aBb2998");
await lconf.updateAToken(["0xe77806aE51F209c3b6490F573BB57877344BbBc9", "0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00", "0x0000000000000000000000000000000000000000", "Aave Casino market IMMO", "aIMMO", "0x56131caD19337568211d138B3F34cA5f02a766AE", '0x10'])
pool.seize("0xf70e545387fce353b184e10e2df01ac95da35e15", ["0xad55dc6cae4219f48cc6c3282e3d3b1a7db53c42"], "0xf70e545387fce353b184e10e2df01ac95da35e15")
await pool.seize('0xF70E545387fCe353b184e10e2dF01AC95DA35e15', ['0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b'], '0xF70E545387fCe353b184e10e2dF01AC95DA35e15')
const params2 = {
    asset : "0xe77806aE51F209c3b6490F573BB57877344BbBc9", 
    treasury : "0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00", 
    incentivesController : "0x0000000000000000000000000000000000000000", 
    name : "Aave Casino market IMMO", 
    symbol : "aIMMO", 
    implementation : "0x56131caD19337568211d138B3F34cA5f02a766AE", 
    params : 0x10}

await permissionManager.connect(signer).addPermissionAdmins(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"])
await permissionManager.addPermissions([0,1,2], ["0xF3aE472fcfeE275d1E4b592Fb4433201E731da38", "0xF3aE472fcfeE275d1E4b592Fb4433201E731da38", "0xF3aE472fcfeE275d1E4b592Fb4433201E731da38"])

// 0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b


await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"]});
// !here
await signer.sendTransaction({value: ethers.utils.parseUnits("2"), to: "0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"});

const lendingPool = await contractGetters.getLendingPool("0xe1437472335FaEdd1AF07C8382458140B563b4d4")

await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"]});
const signerPA = await ethers.provider.getSigner("0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50");

const IMMO = await contractGetters.getIErc20Detailed("0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea")
const DAI = await contractGetters.getIErc20Detailed("0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa")
//const Pooladmin = new ethers.Contract("0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50", pa_abi, signer)
const config = new ethers.Contract("0x752B6e3d1c9A03eB499A2C0f11000E478D954196", confi_abi, signerPA)
await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x3FCAe03DCdBA93dc5dDCf5cfAA33E74Bf9A47554"]});
const signer0 = await ethers.provider.getSigner("0x3FCAe03DCdBA93dc5dDCf5cfAA33E74Bf9A47554");
await IMMO.connect(signer0).approve(lenp.address, ethers.utils.parseUnits('50000000'));
await DAI.connect(signer0).approve(lenp.address, ethers.utils.parseUnits('100000000'));
await lenp.connect(signer0).deposit(IMMO.address, ethers.utils.parseUnits('500'), await signer0.getAddress(), '0');

//const config = await contractGetters.getLendingPoolConfiguratorProxy();
// const CAS = await contractGetters.getIErc20Detailed("0xc774B1f116b1025A4A304096025C68913dE25fD5")
await network.provider.request({ method: "hardhat_impersonateAccount",  params: [conf.address]});


const addressesProvider1 = await contractGetters.getLendingPoolAddressesProvider("0x7189cEBa9dA9Fbed72473Dc9EffB3F8f9044F235");
const admin2 = await addressesProvider1.getPoolAdmin();
await network.provider.request({ method: "hardhat_impersonateAccount",  params: [await signerconfig.getAddress()]});
const signeradmin0 = await ethers.provider.getSigner(admin2.address);

await network.provider.send("hardhat_setBalance", ["0xf295F06fdA206F3ABC45897044B8d3156Ff42458","0x1000",]);


await lenp.connect(signer0).borrow(DAI.address, ethers.utils.parseUnits('500'), await signer0.getAddress(), '0');
const signer1 = signer[1]

await lenp.connect(signer0).setUserUseReserveAsCollateral("0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea", true)
await lenp.connect(signer0).withdraw(IMMO.address, ethers.utils.parseUnits('20'), await signer0.getAddress())
await lenp.connect(signer1).deposit(DAI.address, ethers.utils.parseUnits('300'), await signer1.getAddress(), '0');

await lenp.connect(signer0).borrow(DAI.address, ethers.utils.parseUnits('5'),'2','0', await signer0.getAddress());

await lenp.connect(signer0).repay(DAI.address, ethers.utils.parseUnits('300'),'2', await signer0.getAddress())

    /*



docker-compose run contracts-env npx hardhat --network kovan console

const lendingPool = await contractGetters.getLendingPool("0xe1437472335FaEdd1AF07C8382458140B563b4d4");

const conf = await contractGetters.getLendingPoolConfiguratorProxy("0xe42D8F021d3FD3738BA153180D4E10F9442dD987");

["0x00e048b690a53ED209D3d591395FAbAEdeDc3d12"], ["0x7812e263C6852707bA8c750eeA07556d046378d5"], ["0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"]

await foracle.connect(signer0).setAssetConfig(["0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea"],["0xeCa9Aa4A8dBC11fb8F343695a53D6b84757C868a"],["0x0000000000000000000000000000000000000001"])
    await foracle.connect(signer).setAssetSources(['0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96', '0x0000000000000000000000000000000000000001', '0x00e048b690a53ED209D3d591395FAbAEdeDc3d12'],['0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', '0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13', '0x0000000000000000000000000000000000000000']);

[0x663c6e8Bd60B3f6A9C5bFee2eb4c9f4C63dDCEF3],[0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea],[0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F]

await lenp.connect(signer0).liquidationCall("0xd60062c13822df1a1c78bcbd3d03dded285c46ea","0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea","0xc9fcbc996c4c6bd5680db49b3eeb4c3165424810",ethers.utils.parseUnits('10'),1)

await permit.addPermissions([0,1,2,3], ["0x1BD5503E542733E19A0B6b3b7C92Df60C3398F0E", "0x1BD5503E542733E19A0B6b3b7C92Df60C3398F0E", "0x1BD5503E542733E19A0B6b3b7C92Df60C3398F0E", "0x1BD5503E542733E19A0B6b3b7C92Df60C3398F0E"])
await permit.addPermissionAdmins(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"])


['0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96', '0x0000000000000000000000000000000000000001', '0x00e048b690a53ED209D3d591395FAbAEdeDc3d12'],['0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a', '0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13', '0x0000000000000000000000000000000000000000']
["0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea"], ["0xeCa9Aa4A8dBC11fb8F343695a53D6b84757C868a"], ["0x0000000000000000000000000000000000000001"]
*/