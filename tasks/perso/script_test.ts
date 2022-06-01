import { formatEther } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { impersonateAccountsHardhat } from '../../helpers/misc-utils';
import { ethers } from 'ethers';



// Require
const contractGetters = require('../../helpers/contracts-getters');




task("deposit", "Deposit DAI in Lending pool")
.setAction(async (undefined, DRE) => {
  // Initialize
  await DRE.run("set-DRE");
  // Lending Pool
  const lendingPool = await contractGetters.getLendingPool();
  // Tokens contract addresses
  const DAI = await contractGetters.getIErc20Detailed("0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD");
  // Create signer with DAI
  //await DRE.network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x3FCAe03DCdBA93dc5dDCf5cfAA33E74Bf9A47554"]});
  await impersonateAccountsHardhat(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"]);
  // Create signer account hardhat
  const signer = await DRE.ethers.provider.getSigner("0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810");
  // Print amount
  console.log("DAI deposited:  100");
  // Approve and deposit 100 DAI
  var approve = await DAI.connect(signer).approve(lendingPool.address, DRE.ethers.utils.parseUnits('100'));
  console.log("Approve transaction : \n", approve)
  var deposit = await lendingPool.connect(signer).deposit(DAI.address, DRE.ethers.utils.parseUnits('100'), await signer.getAddress(), '0');
  console.log("Deposit tx :\n", deposit);
});



task("balance", "Give balance in DAI and aDAI", async(undefined, DRE) => {
  await DRE.run("set-DRE");
  // Require
  const contractGetters = require('../../helpers/contracts-getters');
  // Create signer account hardhat
  await impersonateAccountsHardhat(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"]);
  // Create signer account hardhat
  const signer = await DRE.ethers.provider.getSigner("0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810");
  // Tokens contract addresses
  const DAI = await contractGetters.getIErc20Detailed("0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD");
  //const aDAI = await contractGetters.getIErc20Detailed(reserve.kovan.aDAI);
  //const USDT = await contractGetters.getIErc20Detailed(reserve.kovan.USDT);
  //const VDebtUSDT = await contractGetters.getVariableDebtToken(reserve.kovan.vUSDT);
  //const SDebtUSDT = await contractGetters.getStableDebtToken(reserve.kovan.sUSDT); 
  /*
  const XDEV = await contractGetters.getIErc20Detailed(reserve.kovan.XDEV);
  const aXDEV = await contractGetters.getIErc20Detailed(reserve.kovan.aXDEV);
  const vXDEV = await contractGetters.getVariableDebtToken(reserve.kovan.vXDEV);
  const sXDEV = await contractGetters.getStableDebtToken(reserve.kovan.sXDEV); 
  */

  // balance functions
  //var DAIbalance = await DAI.balanceOf(await signer.getAddress());
  //var aDAIbalance = await aDAI.balanceOf(await signer.getAddress());
  //var USDTbalance = await USDT.balanceOf(await signer.getAddress());
  //var VDebtUSDTbalance = await VDebtUSDT.balanceOf(await signer.getAddress());
  //var SDebtUSDTbalance = await SDebtUSDT.balanceOf(await signer.getAddress());
  /*
  var XDEVbalance = await XDEV.balanceOf(await signer.getAddress());
  var aXDEVbalance = await aXDEV.balanceOf(await signer.getAddress());
  var vXDEVbalance = await vXDEV.balanceOf(await signer.getAddress());
  var sXDEVbalance = await sXDEV.balanceOf(await signer.getAddress());*/

  // Print balance
  //console.log("DAI balance : ", Math.round(parseInt(DAIbalance._hex, 16) / 1000000000000000000));
  //console.log("aDAI balance : ", Math.round(parseInt(aDAIbalance._hex, 16) / 1000000000000000000));
  //console.log("USDT balance ; ", Math.round(parseInt(USDTbalance._hex, 16) / 1000000));
  //console.log("Variable Debt USDT balance : ", Math.round(parseInt(VDebtUSDTbalance._hex, 16) / 1000000));
  //console.log("Stable Debt USDT balance : ", Math.round(parseInt(SDebtUSDTbalance._hex, 16) / 1000000));
  /*
  console.log("XDEV balance : ", Math.round(parseInt(XDEVbalance._hex, 16) / 1000000000000000000));
  console.log("aXDEV balance : ", Math.round(parseInt(aXDEVbalance._hex, 16) / 1000000000000000000));
  console.log("Variable Debt XDEV balance : ", Math.round(parseInt(vXDEVbalance._hex, 16) / 1000000000000000000));
  console.log("Stable Debt XDEV balance : ", Math.round(parseInt(sXDEVbalance._hex, 16) / 1000000000000000000));
*/
});




task("borrow", "Borrow USDT with DAI as collateral")
.setAction(async (undefined, DRE) => {
  // Initialize
  await DRE.run("set-DRE");
  // Create signer account hardhat
  await impersonateAccountsHardhat(["0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810"]);
  const signer = await DRE.ethers.provider.getSigner("0xc9FcBC996C4c6Bd5680db49B3EEb4C3165424810");
  // Lending Pool
  const lendingPool = await contractGetters.getLendingPool();
  // Tokens contract addresses
  const CAST = await contractGetters.getIErc20Detailed("0x00e048b690a53ED209D3d591395FAbAEdeDc3d12");
  // function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)
  var borrow = await lendingPool.connect(signer).borrow(CAST.address, DRE.ethers.utils.parseUnits('100'), '2', '0', await signer.getAddress());
  console.log(`Borrow 50 USDT: \n`, borrow);
  //Print balance before swap
  await DRE.run('balance');
  // swap borrow rate mode
  var swap = await lendingPool.connect(signer).swapBorrowRateMode(CAST.address, '2');
  console.log("swap rate tx : ", swap);
  // balance
  await DRE.run('balance');

});

/*

task("repay", "Repay after borrowing")
.setAction(async (undefined, DRE) => {
  // Initialize
  await DRE.run("set-DRE");
  // Lending Pool
  const lendingPool = await contractGetters.getLendingPool(reserve.kovan.LendingPool);
  // contract
  const USDT = await contractGetters.getIErc20Detailed(reserve.kovan.USDT);
  // Create signer account hardhat
  const signer = await DRE.ethers.provider.getSigner(reserve.kovan.signer);
  // repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf)
  var approve = await USDT.connect(signer).approve(lendingPool.address, DRE.ethers.utils.parseUnits('50',6));
  console.log(`Approve USDT: `, approve.hash);
  var repay = await lendingPool.connect(signer).repay(USDT.address, DRE.ethers.utils.parseUnits('50',6), '1', await signer.getAddress());
  console.log(`Repay tx of USDT:`, repay);
  // Print balance
  DRE.run('balance');
});


// function withdraw(address asset, uint256 amount, address to)
task("withdraw", "Withdraw asset deposited")
.setAction(async (undefined, DRE) => {
  // Initialize
  await DRE.run("set-DRE");
  // Lending Pool
  const lendingPool = await contractGetters.getLendingPool(reserve.kovan.LendingPool);
  // contract
  const DAI = await contractGetters.getIErc20Detailed(reserve.kovan.DAI);
  // Create signer account hardhat
  const signer = await DRE.ethers.provider.getSigner(reserve.kovan.signer);
  // Function
  var withdraw = await lendingPool.connect(signer).withdraw(DAI.address, DRE.ethers.utils.parseUnits('100'), await signer.getAddress());
  console.log(withdraw);
  // Print balance
  DRE.run('balance');
});


task("depositCAS", "Deposit CAS in Lending pool")
.setAction(async (undefined, DRE) => {
  // Initialize
  await DRE.run("set-DRE");
  const pa_abi = require('../../abi/PoolAdmin.json')
  const confi_abi = require('../../abi/Configurator.json')
  let initInputParams: {
    aTokenImpl: string;
    stableDebtTokenImpl: string;
    variableDebtTokenImpl: string;
    underlyingAssetDecimals: ethers.BigNumberish;
    interestRateStrategyAddress: string;
    underlyingAsset: string;
    treasury: string;
    incentivesController: string;
    underlyingAssetName: string;
    aTokenName: string;
    aTokenSymbol: string;
    variableDebtTokenName: string;
    variableDebtTokenSymbol: string;
    stableDebtTokenName: string;
    stableDebtTokenSymbol: string;
    params: string;
  }[] = [];


  // Lending Pool
  const lendingPool = await contractGetters.getLendingPool(reserve.kovan.LendingPool);
  // Tokens contract addresses
  await DRE.network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0xc783df8a850f42e7f7e57013759c285caa701eb6"]});
  const signer = await DRE.ethers.provider.getSigner("0xc783df8a850f42e7f7e57013759c285caa701eb6");
  await signer.sendTransaction({value: ethers.utils.parseUnits("2"), to: "0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"});

  await DRE.network.provider.request({ method: "hardhat_impersonateAccount",  params: ["0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50"]});
  const signerPA = await DRE.ethers.provider.getSigner("0x2012b02574F32a96b9CFb8Ba7Fdfd589D5c70F50");
  
  const conf = await contractGetters.getLendingPoolConfiguratorProxy("0xe42D8F021d3FD3738BA153180D4E10F9442dD987");

  // init reserve

  console.log("Fin\n");
});

*/