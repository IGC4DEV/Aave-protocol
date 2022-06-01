// docker-compose run contracts-env npm run console:fork

run('casino:mainnet')
run("set-DRE")
const contractGetters = require('./helpers/contracts-getters');
const init = require('./helpers/init-helpers');
const init2 = require('./helpers/init-helpers');
const c = require('./helpers/configuration');
const mh = require('./helpers/mock-helpers');
const types = require('./helpers/types');
const pa_abi = require('./abi/PoolAdmin.json')
const confi_abi = require('./abi/Configurator.json')
const contractHelpers = require('./helpers/contracts-helpers');
const mu = require('./helpers/misc-utils');
const oracle_abi = require('./artifacts/contracts/misc/CasinoOracle.sol/CasinoMarketOracle.json')
const ao = require('./artifacts/contracts/misc/AaveOracle.sol/AaveOracle.json')
const lp = require('./artifacts/contracts/protocol/lendingpool/PermissionedLendingPool.sol/PermissionedLendingPool.json')
const conf = require('./artifacts/contracts/protocol/lendingpool/LendingPoolConfigurator.sol/LendingPoolConfigurator.json')
const p = require('./artifacts/contracts/protocol/configuration/PermissionManager.sol/PermissionManager.json')
const abi_price = require('./CasinoTokenPrice.json')

let foracle = new ethers.Contract("0x0583FfdC8cae463828fb79F7469f429D5e7b5667", oracle_abi.abi, signer0)
let aoracle = new ethers.Contract("0xd1d79f3dA1B30ec2195511BAaB81A6dF01A66FE6", ao.abi, signer)
let lenp = new ethers.Contract("0xe4CDEdcCBcA2C239f7b5a9b299B4c08F39D65741", lp.abi, signer0)
let lconf = new ethers.Contract("0x664eD6C81060aa4B5689ceED200aBD51C93017A0", conf.abi, signer)
let permit = new ethers.Contract("0x746e7f249e3649eB1f11f609d4ADDeABB6D0D0D6", p.abi, signer0)
let casinotoken = new ethers.Contract("0x746e7f249e3649eB1f11f609d4ADDeABB6D0D0D6", abi_price.abi, signer0)

await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"]});
const signer = await ethers.provider.getSigner();
await signer.sendTransaction({value: ethers.utils.parseUnits("2"), to: "0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"});

const lendingPool = await contractGetters.getLendingPool("0xe1437472335FaEdd1AF07C8382458140B563b4d4")

await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"]});
const signerPA = await ethers.provider.getSigner("0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50");

const CAST = await contractGetters.getIErc20Detailed("0xd60062c13822DF1A1C78BcBD3D03DDED285c46Ea")
const DAI = await contractGetters.getIErc20Detailed("0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa")
//const Pooladmin = new ethers.Contract("0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50", pa_abi, signer)
const config = new ethers.Contract("0x752B6e3d1c9A03eB499A2C0f11000E478D954196", confi_abi, signerPA)
await network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x3FCAe03DCdBA93dc5dDCf5cfAA33E74Bf9A47554"]});
const signer0 = await ethers.provider.getSigner("0x3FCAe03DCdBA93dc5dDCf5cfAA33E74Bf9A47554");
await CAST.connect(signer0).approve(lenp.address, ethers.utils.parseUnits('50000000'));
await DAI.connect(signer0).approve(lenp.address, ethers.utils.parseUnits('100000000'));
await lenp.connect(signer0).deposit(CAST.address, ethers.utils.parseUnits('500'), await signer0.getAddress(), '0');

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
await lenp.connect(signer0).withdraw(CAST.address, ethers.utils.parseUnits('20'), await signer0.getAddress())
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