import Web3 from 'web3';
import { Coin } from '../../constants/coins';

export type MainState = {
  web3: Web3;
  readWeb3: Web3;
  address: string;
  balances?: { [key:string]: string };
  coingeckoPrices?: { [key:string]: number };
  hasUsdcApprove?: boolean;
  hasDaiApprove?: boolean;
  hasMkrApprove?: boolean;
  hasWethApprove?: boolean;
  hasWbtcApprove?: boolean;
  hasMaticApprove?: boolean;
  hasSushiApprove?: boolean;
  hasIdleApprove?: boolean;
  hasUsdcxApprove?: boolean;
  hasDaixApprove?: boolean;
  hasMkrxApprove?: boolean;
  hasWethxApprove?: boolean;
  hasWbtcxApprove?: boolean;
  hasMaticxApprove?: boolean;
  hasSushixApprove?: boolean;
  hasIdlexApprove?: boolean;
  apy?: number,
  rewardsApy?: number,
  feesApy?: number,
  usdcRicFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcSlpEthFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcWethFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  daiMkrFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  mkrDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcMkrFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  mkrUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  daiMaticFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  maticDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcMaticFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  maticUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  daiEthFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  ethDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcWbtcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  wethUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  wbtcUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  usdcIdleFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayusdcWethFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWaywethUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWaywbtcUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayusdcWbtcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayDaiWethFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayWethDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayRicUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayUsdcRicFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayMaticUsdcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayUsdcMaticFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayMaticDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayDaiMaticFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  }
  twoWayWbtcDaiFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  },
  twoWayDaiWbtcFlowQuery?: {
    flowKey: string,
    flowsReceived: number,
    flowsOwned: string,
    totalFlows: number,
    placeholder: string,
    subsidyRate: { perso:number, total:number, endDate:string },
    streamedSoFar:number,
  }
  isLoadingDowngrade: boolean,
  isLoadingUpgrade: boolean,
  isLoading: boolean,
  selectedDowngradeCoin: Coin,
  selectedUpgradeCoin: Coin,
  coinType: Coin,
  isReadOnly: boolean,
  referralId?: string,
};
